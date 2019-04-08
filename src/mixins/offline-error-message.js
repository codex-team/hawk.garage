export const offlineErrorMessage = {
  beforeMount() {
    if (!navigator.onLine) {
      this.message = {
        text: 'Sorry... Your internet connection lost ⛔',
        type: 'error'
      };
    }
  }
};