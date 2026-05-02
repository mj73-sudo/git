import { defineStore } from 'pinia';
import api from '../plugins/axios.ts';
import { TelegramLinkModel } from '../models/TelegramLinkModel.ts';

export const TelegramLink = defineStore('execute TelegramLink', {
  state: () => ({
    loading: false,
    error: '',
    Link: new TelegramLinkModel(),
    accessToken: '',
  }),
  actions: {
    async getLink () {
      try {
        const response = await api.get(`/auth/telegram-link`, {
        });
        this.Link = response.data;
      } catch (error) {
        this.error = 'خطا در حذف استراتژی';
        console.error('Error deleting strategy:', error);
      }
    },
  },
});
