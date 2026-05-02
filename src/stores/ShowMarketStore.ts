import { defineStore } from 'pinia';
import axios from 'axios';
import type { ShowMarketModel } from '../models/ShowMarketModel';
import { usePagination } from '../components/usePagination';
import { ref } from 'vue';
import api from "../plugins/axios.ts";

export const useMarketStore = defineStore('Kline', () => {
  const {
    loading,
    items: market,
    totalItems,
    pagination,
    fetchItems,
    setPage,
    setItemsPerPage,
  } = usePagination<ShowMarketModel>('/klines');

  const error = ref('');

  const getmarket = async (symbolName?: string, resolutions?: string) => {
    let url = `/klines`;
    let param = '';

    if (symbolName) {
      param += (param === '' ? '?' : '&') + 'symbolName=' + encodeURIComponent(symbolName);
    }

    if (resolutions && resolutions.trim() !== '') {
      param += (param === '' ? '?' : '&') + 'resolution=' + encodeURIComponent(resolutions.trim());
    }

    url += param;
    loading.value = true;
    error.value = '';
    try {
      const response = await api.get(url);
      market.value = response.data.content;
    } catch (error) {
      console.error('خطا در دریافت همه استراتژی‌ها:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    market,
    totalItems,
    pagination,
    fetchItems,
    setPage,
    setItemsPerPage,
    getmarket,
    error,
  };
});
