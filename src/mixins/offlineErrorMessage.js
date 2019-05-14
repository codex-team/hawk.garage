export const offlineErrorMessage = {
  beforeMount() {
    console.log(navigator.onLine);
    if (!navigator.onLine) {
      this.message = {
        text: 'Sorry... Your internet connection lost ⛔',
        type: 'error'
      };
    }
  }
};
