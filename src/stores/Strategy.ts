import { defineStore } from 'pinia';
import api from '../plugins/axios';
import { usePagination } from '../components/usePagination.ts';
import  { StrategyModel } from '../models/StrategyModel';
import router from '../router';
import { ref } from 'vue';
import { BookmarkModel } from '../models/BookmarkModel.ts';
import { ActiveModel } from '../models/ActiveModel.ts';
import { strategyinfoModel } from '../models/strategyinfoModel.ts';
import  {DuplicateModel} from "../models/Duplicate.ts";

export const useStrategyStore = defineStore('strategy', () => {
  const {
    loading,
    items: strategies,
    totalItems,
    params,
    pagination,
    fetchItems ,
    setPage,
    setItemsPerPage,
  } = usePagination<StrategyModel>('/strategies');
  const indicators = ref<string[]>([]);
  const active = ref<ActiveModel>(new ActiveModel());
  const canCreate = ref<boolean>(true);
  const indicatorParams=ref<string[]>([]);
  const strategyInfos=ref<strategyinfoModel>(new strategyinfoModel())
  const duplicateModel=ref<DuplicateModel>(new DuplicateModel())
const editStrategy=ref<StrategyModel>(new StrategyModel());

  const getStrategy = async () => {
    loading.value = true;
    try {
      const response = await api.get('/strategies');
      strategies.value = response.data;
    } catch (error) {
      console.error('خطا در دریافت همه استراتژی‌ها:', error);
    } finally {
      loading.value = false;
    }
  };

  const getEdit = async (id:string) => {
    loading.value = true;
    try {
      const response = await api.get(`/strategies/${id}`);
      await fetchItems();
      editStrategy.value = response.data;
    } catch (error) {
      console.error('خطا در دریافت همه استراتژی‌ها:', error);
    } finally {
      loading.value = false;
    }
  };

  const getParam = async (indicatorType: string) => {
    loading.value = true;
    try {
      const response = await api.get(`/strategies/${indicatorType}/params`);
      indicatorParams.value = response.data;
    } catch (error) {
      console.error('خطا در دریافت پارامترها:', error);
    } finally {
      loading.value = false;
    }
  };

  const createStrategy = async (strategymodel: StrategyModel) => {
    loading.value = true;
    try {
      await api.post('/strategies', strategymodel);
      await fetchItems();
      router.push('/strategies');
    } catch (error) {
      console.error('خطا در ایجاد استراتژی:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateStrategy = async (strategymodel: StrategyModel) => {
    loading.value = true;
    try {
      await api.put('/strategies', strategymodel);
      await fetchItems();
    } catch (error) {
      console.error('خطا در ایجاد استراتژی:', error);
    } finally {
      loading.value = false;
    }
  };
  const getAllIndicator = async () => {
    loading.value = true;
    try {
      const response = await api.get(`/strategies/indicators`);
      indicators.value = response.data;
    } catch (error) {
      console.error('خطا در دریافت پارامترها:', error);
    } finally {
      loading.value = false;
    }
  };

  const deleteStrategy = async (id: number | undefined) => {
    loading.value = true;
    try {
      await api.delete(`/strategies/${id}`);
      await fetchItems();
    } catch (error) {
      console.error('خطا در حذف استراتژی', error);
    } finally {
      loading.value = false;
    }
  };

  const duplicateStrategy = async (duplicate:DuplicateModel) => {
    loading.value = true;
    try {
      await api.put(`/strategies/duplicate`,duplicate);
      await fetchItems();
    } catch (error) {
      console.error('خطا در حذف استراتژی', error);
    } finally {
      loading.value = false;
    }
  };

  const statusStrategy = async (activeModel:ActiveModel) => {
    loading.value = true;
    try {
      const response = await api.put('/strategies/active', activeModel); // send ActiveModel as body
      await fetchItems();
      active.value=response.data.active
    } catch (error) {
      console.error('خطا در حذف استراتژی', error);
    } finally {
      loading.value = false;
    }
  };

  const canCreateStrategy = async () => {
    loading.value = true;
    try {
      const response = await api.get('/auth/can-create-strategy'); // send ActiveModel as body
      canCreate.value=response.data;
      if (!canCreate.value) {
        setTimeout(() => {
          router.push('/strategies');
        }, 3000);
      }
      await fetchItems();
    } catch (error) {
      console.error('خطا در حذف استراتژی', error);
    } finally {
      loading.value = false;
    }
  };


  const getStategyinfo = async () => {
    loading.value = true;
    try {
      const response = await api.get('/strategies/strategy-info'); // send ActiveModel as body
      strategyInfos.value=response.data;
    } catch (error) {
      console.error('خطا در حذف استراتژی', error);
    } finally {
      loading.value = false;
    }
  };


  return {
    loading,
    strategies,
    indicators,
    canCreate,
    getAllIndicator,
    totalItems,
    params,
    pagination,
    fetchItems,
    setPage,
    setItemsPerPage,
    duplicateModel,
    getStrategy,
    getParam,
    createStrategy,
    deleteStrategy,
    statusStrategy,
    canCreateStrategy,
    indicatorParams,
    strategyInfos,
    getStategyinfo,
    duplicateStrategy,
    getEdit,
    editStrategy,
    updateStrategy,
  };
});
