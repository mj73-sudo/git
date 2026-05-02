import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    message: '',
    type: 'success', // "success" | "error"
    show: false,
  }),
  actions: {
    showAlert (msg: string, type: 'success' | 'error' = 'success') {
      this.message = msg;
      this.type = type;
      this.show = true;

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.show = false;
      }, 3000);
    },
  },
});
