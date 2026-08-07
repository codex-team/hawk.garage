import {
  UTM_STORAGE_KEY,
  extractUtmParams,
  preserveUtmQuery,
  readStoredUtmParams
} from '../../src/components/utils/utm/utm';

class MemoryStorage {
  private readonly values = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe('UTM', () => {
  it('should extract only valid supported UTM parameters from a route query', () => {
    // Arrange
    const query = {
      utm_source: 'product-hunt',
      utm_campaign: 'summer_2026',
      utm_unknown: 'ignored',
      utm_term: '<script>',
      success: 'signup',
    };

    // Act
    const utm = extractUtmParams(query);

    // Assert
    expect(utm).to.deep.equal({
      source: 'product-hunt',
      campaign: 'summer_2026',
    });
  });

  it('should persist landing UTM and append it to subsequent internal navigation', () => {
    // Arrange
    const storage = new MemoryStorage();

    // Act
    const landingQuery = preserveUtmQuery({
      utm_source: 'newsletter',
      utm_medium: 'email',
      redirect: '/workspace/1',
    }, storage);
    const nextQuery = preserveUtmQuery({ tab: 'billing' }, storage);

    // Assert
    expect(landingQuery).to.deep.equal({
      utm_source: 'newsletter',
      utm_medium: 'email',
      redirect: '/workspace/1',
    });
    expect(readStoredUtmParams(storage)).to.deep.equal({
      source: 'newsletter',
      medium: 'email',
    });
    expect(nextQuery).to.deep.equal({
      tab: 'billing',
      utm_source: 'newsletter',
      utm_medium: 'email',
    });
  });

  it('should keep UTM while auth redirects add their own query parameters', () => {
    // Arrange
    const storage = new MemoryStorage();

    preserveUtmQuery({
      utm_source: 'partner',
      utm_campaign: 'workspace-link',
    }, storage);

    // Act
    const loginQuery = preserveUtmQuery({
      success: 'signup',
      emailPrefilled: 'user@example.com',
    }, storage);

    // Assert
    expect(loginQuery).to.deep.equal({
      success: 'signup',
      emailPrefilled: 'user@example.com',
      utm_source: 'partner',
      utm_campaign: 'workspace-link',
    });
  });

  it('should preserve demo query and replace previous UTM with explicit demo attribution', () => {
    // Arrange
    const storage = new MemoryStorage();

    preserveUtmQuery({ utm_source: 'newsletter' }, storage);

    // Act
    const demoQuery = preserveUtmQuery({ demo: '1' }, storage);
    const registrationQuery = preserveUtmQuery({
      utm_source: 'demo',
      utm_medium: 'demo_banner',
      utm_campaign: 'demo_mode',
    }, storage);

    // Assert
    expect(demoQuery).to.deep.equal({
      demo: '1',
      utm_source: 'newsletter',
    });
    expect(registrationQuery).to.deep.equal({
      utm_source: 'demo',
      utm_medium: 'demo_banner',
      utm_campaign: 'demo_mode',
    });
    expect(storage.getItem(UTM_STORAGE_KEY)).to.equal(JSON.stringify({
      source: 'demo',
      medium: 'demo_banner',
      campaign: 'demo_mode',
    }));
  });

  it('should ignore malformed persisted UTM data', () => {
    // Arrange
    const storage = new MemoryStorage();

    storage.setItem(UTM_STORAGE_KEY, '{broken');

    // Act
    const storedUtm = readStoredUtmParams(storage);
    const query = preserveUtmQuery({}, storage);

    // Assert
    expect(storedUtm).to.equal(undefined);
    expect(query).to.deep.equal({});
  });
});
