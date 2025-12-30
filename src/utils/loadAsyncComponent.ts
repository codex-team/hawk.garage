import { defineAsyncComponent, type Component } from 'vue';

/**
 * Checks if an error is related to chunk loading failure
 * (e.g., when old client tries to load chunks that no longer exist after deployment)
 * @param error - error to check
 * @returns true if error is related to chunk loading failure
 */
function isChunkLoadError(error: unknown): boolean {
  if (error === null || error === undefined) {
    return false;
  }

  let errorString: string;

  if (error instanceof Error) {
    errorString = error.message;
  } else if (typeof error === 'string') {
    errorString = error;
  } else {
    // For objects, try to get a meaningful string representation
    try {
      errorString = JSON.stringify(error);
    } catch {
      errorString = 'Unknown error';
    }
  }

  // Common chunk loading error patterns
  const chunkErrorPatterns = [
    /Failed to fetch dynamically imported module/i,
    /Loading chunk \d+ failed/i,
    /Loading CSS chunk \d+ failed/i,
    /ChunkLoadError/i,
    /Failed to load resource: the server responded with a status of 404/i,
  ];

  return chunkErrorPatterns.some(pattern => pattern.test(errorString));
}

/**
 * Session storage key for tracking chunk reload attempts
 */
const CHUNK_RELOAD_KEY = 'chunk-reload-attempted';

/**
 * Checks if we've already attempted to reload the page for chunk errors
 * @returns true if reload was already attempted in this session
 */
function hasReloadedForChunkError(): boolean {
  try {
    return sessionStorage.getItem(CHUNK_RELOAD_KEY) === 'true';
  } catch {
    // If sessionStorage is not available, return false
    return false;
  }
}

/**
 * Marks that we've attempted to reload for chunk error
 */
function markReloadAttempted(): void {
  try {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, 'true');
  } catch {
    // If sessionStorage is not available, ignore
  }
}

/**
 * Clears the reload flag (called after successful load)
 */
function clearReloadFlag(): void {
  try {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);
  } catch {
    // If sessionStorage is not available, ignore
  }
}

/**
 * Reloads the page to get the latest version of the application
 * This is useful when old client tries to load chunks that no longer exist
 */
function reloadPage(): void {
  markReloadAttempted();
  // Use window.location.reload() to force a full page reload
  window.location.reload();
}

/**
 * Wraps a dynamic import function with error handling for chunk loading failures.
 * If a chunk loading error is detected, the page will be reloaded automatically.
 * @param loader - function that returns a Promise resolving to a component module
 * @returns Promise resolving to the component
 * @example
 * // In router.ts
 * component: loadAsyncComponent(() => import('./components/MyComponent.vue'))
 * @example
 * // With defineAsyncComponent
 * const MyComponent = defineAsyncComponent(
 *   loadAsyncComponent(() => import('./components/MyComponent.vue'))
 * );
 */
export function loadAsyncComponent<T extends Component = Component>(
  loader: () => Promise<{ default: T }>
): () => Promise<{ default: T }> {
  return () => {
    return loader()
      .then((component) => {
        // Clear reload flag on successful load
        clearReloadFlag();

        return component;
      })
      .catch((error) => {
        if (isChunkLoadError(error)) {
          const hasReloaded = hasReloadedForChunkError();

          if (!hasReloaded) {
            console.warn(
              'Chunk loading error detected. This usually happens after a deployment. Reloading page...',
              error
            );
            reloadPage();

            // Return a promise that never resolves to prevent further errors
            // The page will reload before this matters
            return new Promise(() => {
              // Never resolves
            });
          }

          // If we've already reloaded once and still getting errors, it's a real problem
          console.error(
            'Chunk loading failed even after reload. This may indicate a real problem.',
            error
          );
        }

        // Re-throw other errors
        throw error;
      });
  };
}

/**
 * Creates an async component with error handling for chunk loading failures.
 * This is a convenience wrapper around defineAsyncComponent and loadAsyncComponent.
 * @param loader - function that returns a Promise resolving to a component module
 * @returns Vue async component
 * @example
 * const MyComponent = createAsyncComponent(() => import('./components/MyComponent.vue'));
 */
export function createAsyncComponent<T extends Component = Component>(
  loader: () => Promise<{ default: T }>
): ReturnType<typeof defineAsyncComponent> {
  return defineAsyncComponent(loadAsyncComponent(loader));
}
