import { defineStore } from 'pinia';
import type { ListSignalModel } from '../models/ListSignalModel';
import api from '../plugins/axios';
import { usePagination } from '../components/usePagination.ts';
import {SignalinfoModel} from "../models/SignalinfoModel.ts";


export const ListSignalStore = defineStore('signal', () => {
  const {
    loading,
    items: listsignal,
    totalItems,
    pagination,
    fetchItems,
    setPage,
    setItemsPerPage,
  } = usePagination<ListSignalModel>('/signals');
  const signalInfo=ref<SignalinfoModel>(new SignalinfoModel());

  // متد مخصوص گرفتن تمام سیگنال‌ها بدون صفحه‌بندی
  const getListSignal = async () => {
    loading.value = true;
    try {
      const response = await api.get('/signals');
      listsignal.value = response.data.content;
    } catch (error) {
      console.error('خطا در دریافت همه سیگنال‌ها:', error);
    } finally {
      loading.value = false;
    }
  };




  const getsignalInfo = async () => {
    loading.value = true;
    try {
      const response = await api.get('/signals/signal-info');
      signalInfo.value = response.data;
    } catch (error) {
      console.error('خطا در دریافت همه سیگنال‌ها:', error);
    } finally {
      loading.value = false;
    }
  };


  const deleteSignal = async (id: number | undefined) => {
    loading.value = true;
    try {
      await api.delete(`/signals/${id}`);
      await fetchItems();
    } catch (error) {
      console.error('خطا در حذف استراتژی', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    listsignal,
    totalItems,
    pagination,
    fetchItems,
    setPage,
    setItemsPerPage,
    deleteSignal,
    getListSignal,
    signalInfo,
    getsignalInfo,
  };
});
