<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useMarketStore } from '../stores/ShowMarketStore.ts';
  import { ShowMarketModel } from '../models/ShowMarketModel.ts';


  const search = ref('');
  const selectedResolution = ref<number | null>(null);
  const klineStore = useMarketStore();

  const headers = [
    { key: 'symbol.name', title: 'نام ارز' },
    { key: 'resolution', title: 'تایم فریم' },
    { key: 'open', title: 'اولین قیمت' },
    { key: 'high', title: 'بالاترین قیمت' },
    { key: 'low', title: 'پایین ترین قیمت' },
    { key: 'close', title: 'قیمت نهایی' },
    { key: 'volume', title: 'حجم' },
  ];

  const itemsResoulotion = [5, 60];

  onMounted(() => {
    filter();
  });

  const filter = () => {
    klineStore.getmarket(search.value, selectedResolution.value != null ? selectedResolution.value.toString() : undefined);
  };

  const filteredKlines = computed(() => {
    const searchTerm = search.value.toLowerCase().trim();
    const resolution = selectedResolution.value;

    return klineStore.market.filter((kline:ShowMarketModel) => {
      const symbolName = kline.symbol?.name?.toLowerCase() || '';
      const matchesSymbol = !searchTerm || symbolName.includes(searchTerm);
      const matchesResolution = !resolution || kline.resolution === resolution.toString();

      return matchesSymbol && matchesResolution;
    });
  });


</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2" style="font-family: 'Shabnam', sans-serif;">
      <v-row class="mx-auto pa-0 mt-1" cols="12">
        <v-col cols="2">
          <v-icon icon="mdi-video-input-component" /> &nbsp;
          وضعیت مارکت
        </v-col>
        <v-spacer />

        <v-col cols="4">
          <v-text-field
            v-model="search"
            density="compact"
            flat
            hide-details
            label="Search"
            prepend-inner-icon="mdi-magnify"
            single-line
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="4">
          <v-select
            v-model="selectedResolution"
            clearable
            density="compact"
            flat
            hide-details
            :items="itemsResoulotion"
            label="تایم فریم"
            variant="solo-filled"
          />
        </v-col>
        <v-col col="2">
          <v-btn
            class="ml-2"
            color="primary"
            elevation="1"
            rounded
            style="font-weight: 700; letter-spacing: 0.05em; text-transform: none;"
            @click="filter"
          >
            اعمال فیلتر
            <v-icon end style="font-size: 20px;">mdi-filter</v-icon>
          </v-btn>

        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-row class="mt-2" cols="12" dense>
      <v-col cols="12">
        <v-data-table-server
          v-model:items-per-page="klineStore.pagination.itemsPerPage"
          class="custom-table"
          :headers="headers"
          item-key="id"
          :items="klineStore.market"
          :items-length="klineStore.totalItems"
          :page="klineStore.pagination.page"
          show-current-page
          @update:items-per-page="klineStore.setItemsPerPage"
          @update:page="klineStore.setPage"
        >
<!--        <v-data-table
          class="text-no-wrap bg-white rounded"
          density="compact"
          :headers="headers"
          hide-default-footer
          item-key="index"
          :items="filteredKlines"
        >-->
          <template #item.symbol.name="{ item }">
            <span>{{ item.symbol?.name }}</span>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-card>
</template>
