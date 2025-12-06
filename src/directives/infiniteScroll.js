/**
 * Vue 3 compatible infinite scroll directive
 * Replaces vue-infinite-scroll package which is Vue 2 only
 *
 * Usage:
 *   <div
 *     v-infinite-scroll="loadMore"
 *     :infinite-scroll-disabled="false"
 *     infinite-scroll-distance="300"
 *   >
 */

/**
 * Find the scrollable parent element
 *
 * @param {HTMLElement} element - element to start searching from
 * @returns {HTMLElement|Window} - scrollable element (element itself or parent)
 */
function findScrollableElement(element) {
  /**
   * Check if element itself is scrollable
   */
  const style = window.getComputedStyle(element);
  const isScrollable = (
    style.overflowY === 'auto'
    || style.overflowY === 'scroll'
    || style.overflow === 'auto'
    || style.overflow === 'scroll'
  );

  if (isScrollable && element.scrollHeight > element.clientHeight) {
    return element;
  }

  /**
   * Check parent elements up to body
   */
  let parent = element.parentElement;

  while (parent && parent !== document.body) {
    const parentStyle = window.getComputedStyle(parent);
    const parentIsScrollable = (
      parentStyle.overflowY === 'auto'
      || parentStyle.overflowY === 'scroll'
      || parentStyle.overflow === 'auto'
      || parentStyle.overflow === 'scroll'
    );

    if (parentIsScrollable && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }

    parent = parent.parentElement;
  }

  /**
   * Fallback to window if no scrollable parent found
   */
  return window;
}

export default {
  mounted(el, binding) {
    /**
     * Get callback function from binding value
     */
    const callback = binding.value;

    if (typeof callback !== 'function') {
      console.warn('v-infinite-scroll: callback must be a function');

      return;
    }

    /**
     * Find the scrollable container (element itself or parent)
     */
    const scrollContainer = findScrollableElement(el);

    /**
     * Get distance from attribute or default to 300
     *
     * @returns {number} - distance in pixels
     */
    const getDistance = () => {
      const attrValue = el.getAttribute('infinite-scroll-distance');

      return attrValue ? parseInt(attrValue, 10) : 300;
    };

    /**
     * Get disabled state from attribute
     * Vue 3: boolean attributes are removed when false, present (empty string) when true
     *
     * @returns {boolean} - true if disabled
     */
    const getDisabled = () => {
      const attrValue = el.getAttribute('infinite-scroll-disabled');

      /**
       * If attribute exists, check its value
       * Empty string means true (Vue 3 boolean attribute)
       * 'false' string means false
       * Attribute not present means false
       */
      if (attrValue === null) {
        return false;
      }

      if (attrValue === '') {
        return true;
      }

      return attrValue === 'true';
    };

    /**
     * Store callback and options on element for cleanup
     */
    el._infiniteScroll = {
      callback,
      getDistance,
      getDisabled,
      scrollHandler: null,
      isScrolling: false,
      scrollContainer,
    };

    /**
     * Create scroll handler with debouncing to prevent multiple rapid calls
     */
    const scrollHandler = () => {
      if (el._infiniteScroll.isScrolling) {
        return;
      }

      if (el._infiniteScroll.getDisabled()) {
        return;
      }

      /**
       * Get scroll properties from the scrollable container
       */
      const container = el._infiniteScroll.scrollContainer;
      const scrollTop = container === window
        ? window.pageYOffset || document.documentElement.scrollTop
        : container.scrollTop;
      const scrollHeight = container === window
        ? document.documentElement.scrollHeight
        : container.scrollHeight;
      const clientHeight = container === window
        ? window.innerHeight
        : container.clientHeight;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;
      const distance = el._infiniteScroll.getDistance();

      /**
       * Check if scrolled within distance threshold
       */
      if (scrollBottom <= distance) {
        el._infiniteScroll.isScrolling = true;

        /**
         * Call callback immediately for better responsiveness
         */
        try {
          el._infiniteScroll.callback();
        } finally {
          /**
           * Reset flag after a short delay to prevent rapid multiple calls
           */
          setTimeout(() => {
            el._infiniteScroll.isScrolling = false;
          }, 100);
        }
      }
    };

    el._infiniteScroll.scrollHandler = scrollHandler;

    /**
     * Attach scroll listener to the scrollable container
     */
    scrollContainer.addEventListener('scroll', scrollHandler, { passive: true });

    /**
     * Watch for attribute changes (infinite-scroll-disabled, infinite-scroll-distance)
     */
    const observer = new MutationObserver(() => {
      /**
       * Attributes are reactive, so we'll read them on each scroll check
       * No need to store them, just update the getters
       */
    });

    observer.observe(el, {
      attributes: true,
      attributeFilter: ['infinite-scroll-disabled', 'infinite-scroll-distance'],
    });

    el._infiniteScroll.observer = observer;
  },

  updated(el, binding) {
    /**
     * Update callback if it changed
     */
    if (el._infiniteScroll && binding.value !== el._infiniteScroll.callback) {
      el._infiniteScroll.callback = binding.value;
    }
  },

  unmounted(el) {
    /**
     * Cleanup: remove event listener and observer
     */
    if (el._infiniteScroll) {
      const scrollContainer = el._infiniteScroll.scrollContainer;

      if (el._infiniteScroll.scrollHandler) {
        scrollContainer.removeEventListener('scroll', el._infiniteScroll.scrollHandler);
      }

      if (el._infiniteScroll.observer) {
        el._infiniteScroll.observer.disconnect();
      }

      delete el._infiniteScroll;
    }
  },
};
