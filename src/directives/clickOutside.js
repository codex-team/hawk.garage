/**
 * Custom directive 'click-outside' for handling outside clicks from components
 *
 * @example
 *   1) connect ->  app.directive('click-outside', DirectiveClickOutside);
 *   2) enjoy   ->  <component v-click-outside="SOME_METHOD" />
 *
 * where SOME_METHOD must be a function
 */
export default {
  mounted(el, binding, vnode) {
    // Provided expression must evaluate to a function.
    if (typeof binding.value !== 'function') {
      const compName = vnode.component?.name || vnode.type?.name;

      let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;

      if (compName) {
        warn += `Found in component '${compName}'`;
      }

      console.warn(warn);

      return;
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

  unmounted(el) {
    // Remove Event Listeners
    if (el.__vueClickOutside__) {
      document.removeEventListener('click', el.__vueClickOutside__);
      el.__vueClickOutside__ = null;
    }
  },
};
