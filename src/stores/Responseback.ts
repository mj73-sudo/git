import { defineStore } from 'pinia';
import { ResponsebackModel } from '../models/ResponsebackModel.ts';
import api from '../plugins/axios.ts';
import { BacktestInfo } from '../models/BacktestInfo.ts';

export const useBackTest = defineStore('backtest', {
  state: () => ({
    loading: false,
    error: '',
    backtests: [] as ResponsebackModel[],
    backtestsShow: [] as ResponsebackModel[],
    accessToken: '',
    totalItems: 0,
    backtestInfo:new BacktestInfo(),
    pagination: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  actions: {
    async getResponseback () {
      const response = await api.get('/back-tests', {
      });

      this.totalItems = response.data.totalElements;
      this.pagination.page = response.data.number + 1;
      this.backtests = response.data.content;
      this.backtestsShow=response.data


    },
    async getacktestShow(id: string) {
      const response = await api.get(`/back-tests/${id}`);
      this.backtestsShow = response.data;
    },


    async getbacktestInfo () {

      this.loading = true;
      try {
        const response = await api.get('/back-tests/backtest-info',{
        });

        this.backtestInfo = response.data;


      } catch (error) {
        console.error('خطا در دریافت دیتا:', error);
      } finally {
        this.loading = false;
      }


    },
    async fetchItems () {
      this.loading = true;
      try {
        const page = this.pagination.page - 1; // API از 0 شروع می‌کند
        const size = this.pagination.itemsPerPage;
        const url = `/back-tests?page=${page}&size=${size}`;
        const response = await api.get(url,{
        });

        this.backtests = response.data.content;
        this.totalItems = response.data.totalElements;
        this.pagination.page = response.data.number + 1;

      } catch (error) {
        console.error('خطا در دریافت دیتا:', error);
      } finally {
        this.loading = false;
      }
    },

    async setPage (page: number) {
      this.pagination.page = page;
      await this.fetchItems();
    },

    async setItemsPerPage (size: number) {
      this.pagination.itemsPerPage = size;
      this.pagination.page = 1; // بازگشت به صفحه اول
      await this.fetchItems();
    },

  },
});
