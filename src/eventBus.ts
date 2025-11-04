/**
 * Event bus is used to communicate unrelated sections of application
 */
class EventBus {
  private listeners: { [event: string]: Function[] } = {};

  $on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  $off(event: string, callback?: Function): void {
    if (!this.listeners[event]) {
      return;
    }

    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      this.listeners[event] = [];
    }
  }

  $emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event].forEach((callback) => {
      callback(...args);
    });
  }

  $once(event: string, callback: Function): void {
    const onceCallback = (...args: any[]) => {
      callback(...args);
      this.$off(event, onceCallback);
    };

    this.$on(event, onceCallback);
  }
}

export default new EventBus();
