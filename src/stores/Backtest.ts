import { defineStore } from 'pinia';
import { BacktestModel } from '../models/BacktestModel.ts';
import api from '../plugins/axios.ts';

export const BacktestStore = defineStore('execute backtest', {
  state: () => ({
    loading: false,
    error: '',
    backtests: [] as BacktestModel[],
    accessToken: '',
  }),
  actions: {
    async CreateBacktest ( backtestmodel: BacktestModel) {
      try {
        const response = await api.post(`/back-tests`, backtestmodel, {
        });
        this.backtests = response.data;
      } catch (error) {
        this.error = 'خطا در حذف استراتژی';
        console.error('Error deleting strategy:', error);
      }
    },
  },
});
