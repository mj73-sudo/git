import { defineStore } from 'pinia';
import { PageableModel } from '../models/PageableModel.ts';
import api from '../plugins/axios.ts';


export const useMarketStore = defineStore('Kline', {
  state: () => ({
    loading: false,
    error: '',
    accessToken: '',
    items :[] as PageableModel[],
    totalItems: 0,
    pagination: {
      page: 1,
      itemsPerPage: 20,
    },
  }),
  actions: {
    async fetchItems () {
      this.loading = true;
      try {
        const page = this.pagination.page - 1; // 👈 چون API از 0 شروع می‌کنه
        const size = this.pagination.itemsPerPage;

        const url = `/api/users?page=${page}&pageSize=${size}`;
        const response = await api.get(url);

        this.items = response.data.content; // 👈 فرض بر اینکه دیتا داخل content هست
        this.totalItems = response.data.totalElements;
        this.pagination.page = response.data.number + 1; // 👈 تبدیل از 0-based به 1-based

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
