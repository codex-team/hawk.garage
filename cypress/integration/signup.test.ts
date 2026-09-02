describe('Sign Up', () => {
  const user = {
    email: 'user@test.com',
  };

  beforeEach(() => {
    cy.visitHawk('sign-up');
  });

  afterEach(() => {
    cy.deleteUser(user.email);
    cy.clearStorage();
  });

  it('should open login page on click on login', () => {
    cy.contains('Login')
      .click();

    cy.location('pathname')
      .should('eq', '/login');
  });

  it('should store UTM from the landing URL in sessionStorage', () => {
    // Arrange
    const path = 'sign-up?utm_source=google&utm_medium=cpc&utm_campaign=spring';

    // Act
    cy.visitHawk(path);

    // Assert
    cy.window()
      .then((win) => {
        expect(JSON.parse(win.sessionStorage.getItem('hawk_utm') ?? '{}')).to.deep.include({
          source: 'google',
          medium: 'cpc',
          campaign: 'spring',
        });
      });
  });

  it('should store UTM when redirected from a protected page to login', () => {
    // Arrange
    const path = '?utm_source=google&utm_campaign=spring';

    // Act
    cy.visitHawk(path);

    // Assert
    cy.location('pathname')
      .should('eq', '/login');
    cy.window()
      .then((win) => {
        expect(JSON.parse(win.sessionStorage.getItem('hawk_utm') ?? '{}')).to.deep.include({
          source: 'google',
          campaign: 'spring',
        });
      });
  });

  it('should send stored UTM in signup after navigating through login', () => {
    // Arrange
    cy.intercept('POST', '/graphql').as('graphql');
    cy.visitHawk('sign-up?utm_source=google&utm_campaign=spring');
    cy.contains('Login')
      .click();
    cy.contains('Sign up')
      .click();

    // Act
    cy.register(user.email);

    // Assert
    cy.wait('@graphql')
      .then((interception) => {
        expect(interception.request.body.variables.utm).to.deep.include({
          source: 'google',
          campaign: 'spring',
        });
      });
  });

  it('should open login page after signup', () => {
    cy.register(user.email);

    cy.location('pathname')
      .should('eq', '/login');

    cy.contains('The password is sent to your email')
      .should('exist');
  });

  it('should fill email on login page after signup', () => {
    cy.register(user.email);

    cy.location('pathname')
      .should('eq', '/login');

    cy.get('input#email')
      .should('have.value', user.email);
  });

  it('should be able to login after signup', () => {
    cy.intercept('POST', '/graphql').as('signup');
    cy.register(user.email);

    cy.wait('@signup')
      .then(interception => {
        const password = interception.response!.body.data.signUp;

        cy.login(undefined, password);

        cy.location('pathname')
          .should('eq', '/');
      });
  });

  it('should show error if email is already registered', () => {
    cy.createUser(user.email, '123456');

    cy.register(user.email);

    cy.contains('User with this email already registered')
      .should('exist');
  });

  it('should validate email field to not to be empty', () => {
    cy.contains('Register')
      .click();

    cy.get('input:invalid')
      .should('have.attr', 'id', 'email');
  });

  it('should validate email field to be email', () => {
    cy.register('notanemailstring');

    cy.get('input:invalid')
      .should('have.attr', 'id', 'email');
  });
});
