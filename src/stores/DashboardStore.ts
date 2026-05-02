import { defineStore } from 'pinia';
import api from '../plugins/axios';
import { ref } from 'vue';
import { OverviewModel } from '../models/OverviewModel.ts';
import {TopStrategyModel} from "../models/TopStrategyModel.ts";

export const useDashboardStore = defineStore('dashboard', () => {

  const loading = ref(false);
  const stats = ref<OverviewModel>(new OverviewModel());
  const topStrategies = ref<TopStrategyModel[]>([]);

  const getOverview = async () => {
    loading.value = true;

    try {
      const response = await api.get('/dashboard/overview');
      stats.value = response.data
    } catch (error) {
      console.error('خطا در دریافت آمار داشبورد:', error);
    } finally {
      loading.value = false;
    }
  };


  const getTopStrategy= async () => {
    loading.value = true;

    try {
      const response = await api.get('/dashboard/top-strategies');
      topStrategies.value = response.data
    } catch (error) {
      console.error('خطا در دریافت آمار داشبورد:', error);
    } finally {
      loading.value = false;
    }
  };
  return {
    loading,
    stats,
    getOverview,
    getTopStrategy,
    topStrategies,
  };
});
