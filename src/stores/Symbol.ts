import { defineStore } from 'pinia';
import { SymbolModel } from '../models/SymbolModel.ts';
import { BookmarkModel } from '../models/BookmarkModel.ts';
import { ActiveModel } from '../models/Active.ts';
import api from '../plugins/axios.ts';

export const SymbolStore = defineStore('symbol', {
  state: () => ({
    loading: false,
    error: '',
    symbols: [] as SymbolModel[],
    accessToken: '',
    bookmarks: new BookmarkModel(),
    active: new ActiveModel(),
    totalItems: 0,
    pagination: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  actions: {
    async getSymbol () {
      this.loading = true;
      this.error = '';
      try {
        const response = await api.get('/symbols', {
        });
        this.symbols = response.data.content;
        this.totalItems = response.data.totalElements;
        this.pagination.page = response.data.number + 1;
      } catch (error: unknown) {
        this.error = 'خطایی در دریافت نمادها رخ داد';
        console.error('Error during fetching symbols:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateBookmark (bookmark:BookmarkModel) {
      this.loading = true;
      this.error = '';
      try {
        const response=await api.put('/symbols/bookmark',bookmark,{
        });
        this.bookmarks=response.data;
        await this.fetchItems(); // بروزرسانی جدول بعد از bookmark
      } catch (error: unknown) {
        this.error = 'خطایی در بروزرسانی بوکمارک رخ داد';
        console.error('Error during bookmark update:', error);
      } finally {
        this.loading = false;
      }
    },

    async isActive (active:ActiveModel) {
      this.loading = true;
      this.error = '';
      try {
        const response=await api.put('/symbols/active',active,{
        });
        this.active=response.data;
        await this.fetchItems(); // بروزرسانی جدول بعد از تغییر وضعیت
      } catch (error: unknown) {
        this.error = 'خطایی در بروزرسانی وضعیت رخ داد';
        console.error('Error during active update:', error);
      } finally {
        this.loading = false;
      }
    },

    async Createsymbol (symbolmodel: SymbolModel) {
      this.loading = true;
      this.error = '';
      try {
        const response=await api.post('/symbols',symbolmodel,{
        });
        this.symbols=response.data;

        // دریافت دوباره داده‌ها بعد از ایجاد نماد جدید
        await this.fetchItems();
      } catch (error: unknown) {
        this.error = 'خطایی در ایجاد نماد رخ داد';
        console.error('Error during symbol creation:', error);
      } finally {
        this.loading = false;
      }
    },

    // Pagination
    async fetchItems () {
      this.loading = true;
      try {
        const page = this.pagination.page - 1; // API از 0 شروع می‌کند
        const size = this.pagination.itemsPerPage;
        const url = `/symbols?page=${page}&size=${size}`;
        const response = await api.get(url,{
        });

        this.symbols = response.data.content;
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

    async searchSymbol (
      name?: string,
      active?: boolean,
      exchange?: string,
      symbolType?: string,
      bookmark?: boolean
    ) {
      let url = '/symbols';
      const params: string[] = [];

      if (name) params.push('name=' + encodeURIComponent(name));
      if (active !== undefined) params.push('active=' + active)
      if (exchange) params.push('exchange=' + encodeURIComponent(exchange));
      if (symbolType) params.push('symbolType=' + encodeURIComponent(symbolType));
      if (bookmark !== undefined) params.push('bookmark=' + bookmark)
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      this.loading = true;
      this.error = '';

      try {
        const response = await api.get(url, {
        });
        this.symbols = response.data.content;
        console.log('filtered symbols:', response.data.content);
      } catch (e: any) {
        console.error('خطا:', e.response?.data);
      } finally {
        this.loading = false;
      }
    },

  },
});
