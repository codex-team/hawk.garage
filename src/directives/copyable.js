/**
 * Custom directive 'copyable' to allow content copy-by-click on the element
 * @usage 1) connect   -> Vue.directive('copyable', DirectiveCopyable);
 * @usage 2) enjoy     -> <component v-copyable="{selector: CHILD_SELECTOR, callback: CALLBACK_FUNCTION" />
 *
 * Where selector is selector of child element whose content should be copied
 */
export default {
  bind(el, binding, vNode) {
    if (typeof binding.value.selector !== 'string') {
      const compName = vNode.context.name;

      let warn = '[Vue-copyable:] provided selector is not a string, but has to be';

      if (compName) {
        warn += `Found in component '${compName}'`;
      }

      console.warn(warn);
    }

    const childToCopy = el.querySelector(binding.value.selector);

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

  unbind(el) {
    // Remove Event Listeners
    el.removeEventListener('click', el.__vueCopyable__);
    el.__vueCopyable___ = null;
  }
};
