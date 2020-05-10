/**
 * Custom directive 'click-outside' for handling outside clicks from components
 *
 * @example
 *   1) connect ->  Vue.directive('click-outside', DirectiveClickOutside);
 *   2) enjoy   ->  <component v-click-outside="SOME_METHOD" />
 *
 * where SOME_METHOD must be a function
 */
export default {
  bind(el, binding, vNode) {
    // Provided expression must evaluate to a function.
    if (typeof binding.value !== 'function') {
      const compName = vNode.context.name;

      let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;

      if (compName) {
        warn += `Found in component '${compName}'`;
      }

      console.warn(warn);
    }
    // Define Handler and cache it on the element
    const bubble = binding.modifiers.bubble;
    const handler = (e) => {
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e);
      }
    };

    el.__vueClickOutside__ = handler;

    // add Event Listeners
    document.addEventListener('click', handler);
  },

  unbind(el) {
    // Remove Event Listeners
    document.removeEventListener('click', el.__vueClickOutside__);
    el.__vueClickOutside__ = null;
  },
};
