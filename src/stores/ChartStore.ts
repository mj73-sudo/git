import { defineStore } from 'pinia';
import { DataChartModel } from '../models/DataChartModel.ts';
import api from "../plugins/axios.ts";

export const useChartStore = defineStore('detail', {
  state: () => ({
    loading: false,
    error: '',
    dataChart: {
      label: [],
      value: [],
    } as DataChartModel,
    accessToken: '',

  }),
  actions: {
    async getChartData (id: string) {
      this.loading = true;
      this.error = '';
      try {
        const response = await api.get(`/back-tests/${id}`, {
        });
        this.dataChart = response.data;
      } catch (e) {
        this.error = 'مشکل در دریافت اطلاعات';
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
