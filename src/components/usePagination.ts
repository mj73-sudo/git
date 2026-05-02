import { ref } from 'vue';
import api from '../plugins/axios.ts';


export function usePagination<T>(endpoint: string) {
  const loading = ref(false);
  const items = ref<T[]>([]);
  const params = ref<T[]>([]);
  const totalItems = ref(0);
  const pagination = ref({
    page: 1,
    itemsPerPage: 10,
  });

  const fetchItems = async () => {
    loading.value = true;
    try {
      const page = pagination.value.page - 1;
      const size = pagination.value.itemsPerPage;

      const url = `${endpoint}?page=${page}&size=${size}`;
      const response = await api.get(url);

      items.value = response.data.content;
      params.value=response.data
      totalItems.value = response.data.totalElements;
      pagination.value.page = response.data.number + 1;
    } catch (error) {
      console.error(`❌ خطا در دریافت داده از ${endpoint}:`, error);
    } finally {
      loading.value = false;
    }
  };

  const setPage = async (page: number) => {
    pagination.value.page = page;
    await fetchItems();
  };

  const setItemsPerPage = async (size: number) => {
    pagination.value.itemsPerPage = size;
    pagination.value.page = 1;
    await fetchItems();
  };

  return {
    loading,
    items,
    params,
    totalItems,
    pagination,
    fetchItems,
    setPage,
    setItemsPerPage,
  };
}
