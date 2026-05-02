<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useMarketStore } from '../stores/ShowMarketStore.ts'
  import { SymbolStore } from '../stores/Symbol.ts'
  import { SymbolModel } from '../models/SymbolModel.ts'
  import { SearchModel } from '../models/SearchModel.ts';
  import type { FieldDefinition } from '../models/FieldDefinition.Model.ts';
  import type { StrategyModel } from '../models/StrategyModel.ts';

  const markestore = useMarketStore()
  const symbolstore = SymbolStore()
  const symbolmodel = ref('')
  const symbolId = ref<number>()
  const resolutions = ref('')
  const resolution = ['15','60','10']

  // ستون‌ها
  import type { DataTableHeader } from 'vuetify';
  const headers: DataTableHeader[] = [
    { key: 'index', title: 'ردیف', align: 'center' },
    { key: 'symbolName', value: 'symbol.name', title: 'نام ارز', align: 'center' },
    { key: 'resolution', title: 'تایم فریم', align: 'center' },
    { key: 'open', title: 'اولین قیمت', align: 'center' },
    { key: 'high', title: 'بالاترین قیمت', align: 'center' },
    { key: 'low', title: 'پایین ترین قیمت', align: 'center' },
    { key: 'close', title: 'قیمت نهایی', align: 'center' },
    { key: 'volume', title: 'حجم', align: 'center' },
  ]


  // mount
  onMounted(async () => {
    await symbolstore.getSymbol()
    await markestore.fetchItems()
  })

  // تغییر نماد
  function onSymbolChange (s: SymbolModel){
    symbolId.value = s.id
  }

  // اعمال فیلتر
  const runFilter = async () => {
    await markestore.getmarket(searchModel.value.symbol,searchModel.value.resolution?.toString())
  }
  const searchModel=ref<SearchModel>(new SearchModel())
  const fields: FieldDefinition<SearchModel>[] = [
    { type: 'text', name: 'symbol', title: 'نام سیمبل', md: 5 },

    {
      type: 'select',
      md: 5,
      name: 'resolution',
      title: 'تایم فریم',
      items: [
        { name: 15, value: 15 },
        { name: 10, value: 10 },
      ],
      itemTitle: 'name',
      itemValue: 'value',
    },
  ];

</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      <v-icon class="me-2" color="primary">mdi-chart-line</v-icon>
      <span class="text-h6-bold">وضعیت مارکت </span>
      <v-spacer />
    </v-card-title>


    <v-divider />

    <v-row class="mt-4 mr-5 mb-8" dense>
      <!-- فیلد نماد -->
      <v-col cols="12" md="6">
        <MainsForm v-model="searchModel" :fields="fields" />
      </v-col>
      <!-- دکمه فیلتر -->
      <v-col class="d-flex justify-start" cols="12" md="2">
        <v-btn block color="primary" @click="runFilter">
          <v-icon start>mdi-filter</v-icon> اعمال فیلتر
        </v-btn>
      </v-col>
    </v-row>


    <v-data-table-server
      v-model:items-per-page="markestore.pagination.itemsPerPage"
      :headers="headers"
      height="400"
      item-key="id"
      :items="markestore.market"
      :items-length="markestore.totalItems"
      :page="markestore.pagination.page"
      show-current-page
      style="text-align-last: center"
      @update:items-per-page="markestore.setItemsPerPage"
      @update:page="markestore.setPage"
    >
      <template #item.index="{ index }">
        <div>{{ index + 1 }}</div>
      </template>
      <template #item.symbol="{ item }">
        <span>{{ item.symbol?.name ?? '—' }}</span>
      </template>
    </v-data-table-server>
  </v-card>
</template>
