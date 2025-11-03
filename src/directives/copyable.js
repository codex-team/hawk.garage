/**
 * Custom directive 'copyable' to allow content copy-by-click on the element
 *
 * @example
 *  1) connect ->  app.directive('copyable', DirectiveCopyable);
 *  2) enjoy   ->  <component v-copyable="{selector: CHILD_SELECTOR, callback: CALLBACK_FUNCTION" />
 *
 * Where selector is selector of child element whose content should be copied
 */
export default {
  mounted(el, binding, vnode) {
    if (!binding.value?.selector) {
      return;
    }

    if (typeof binding.value.selector !== 'string') {
      const compName = vnode.component?.name || vnode.type?.name;

      let warn = '[Vue-copyable:] provided selector is not a string, but has to be';

      if (compName) {
        warn += `Found in component '${compName}'`;
      }

      console.warn(warn);
    }

    const childToCopy = el.querySelector(binding.value.selector);

    if (!childToCopy) {
      console.warn('[Vue-copyable:] child element not found for selector:', binding.value.selector);
      return;
    }

    const handler = () => {
      const range = new Range();
      const selection = window.getSelection();

      range.selectNodeContents(childToCopy);

      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand('copy');

      if (binding.value.callback && typeof binding.value.callback === 'function') {
        binding.value.callback(range.toString());
      }
    };

    el.__vueCopyable__ = handler;

    // add Event Listeners
    el.addEventListener('click', handler);
  },

  unmounted(el) {
    // Remove Event Listeners
    if (el.__vueCopyable__) {
      el.removeEventListener('click', el.__vueCopyable__);
      el.__vueCopyable__ = null;
    }
  },
};
