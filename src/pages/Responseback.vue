<script setup lang="ts">
  import { useBackTest } from '../stores/Responseback.ts';
  import router from '../router';
  import { onMounted } from 'vue';
  import { NumberHelper } from '../components/NumberHelper.ts';

  const backTestStore = useBackTest();

  const headers = [
    { key: 'index', title: 'ردیف', align: 'center' as const },
    { key: 'symbol', title: 'نماد', align: 'center' as const },
    { key: 'type', title: 'نوع سیگنال', align: 'center' as const },
    { key: 'strategy', title: 'استراتژی', align: 'center' as const },
    { key: 'initialCapital', title: 'بودجه اولیه', align: 'center' as const },
    { key: 'finalCapital', title: 'بودجه نهایی', align: 'center' as const },
    { key: 'totalProfit', title: 'سود', align: 'center' as const },
    { key: 'totalTrades', title: 'معاملات', align: 'center' as const },
    { key: 'winTrades', title: 'برد', align: 'center' as const },
    { key: 'winRate', title: 'نرخ برد', align: 'center' as const },
    { key: 'status', title: 'وضعیت', align: 'center' as const },
    { key: 'chart', title: 'چارت', align: 'center' as const },
  ]


  onMounted(async () => {
    backTestStore.fetchItems();
    backTestStore.getbacktestInfo();
  })
  function showChart (id?: number) {
    if (!id) return;
    router.push({ path: `/chart/${id}` });
  }

  /*  const colorInitialCapital= (capital :number)=>{
  if (capital > 0) return 'green';
  if (capital < 0) return 'red';
  if (capital === 0) return 'blue';
  return 'yellow';
}*/
  const colorReturn = (initial: number, final: number) => {
    if (initial === 0) return 'orange'; // جلوگیری از تقسیم بر صفر
    const diff = final - initial;
    if (diff > 0) return 'success'; // سبز برای سود
    if (diff < 0) return 'error'; // قرمز برای ضرر
    return 'warning'; // صفر
  }

  function calcWinRate (winTrades: number, totalTrades: number) {
    if (!totalTrades) return '0%';
    const percent = (winTrades / totalTrades) * 100;
    return percent.toFixed(2) + '%';
  }

  const formatReturnPercent = (initial: number, final: number) => {
    const percent = ((final - initial) / initial) * 100;
    return (percent > 0 ? '+' : '') + percent.toFixed(2) + '%';
  };
</script>

<template>
  <v-card class="home-page">
    <v-card-title>
      <v-row class="mt-4 mr-1">
        <v-col cols="12" md="6">
          <v-icon size="20">mdi-finance</v-icon>
          <span class="text-sm-body-1"> جدول شروط انتخاب‌شده</span>
        </v-col>
      </v-row>
    </v-card-title>
    <v-row class="d-flex mx-auto justify-center" style="width: 96%;">
      <v-col cols="12" md="4">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#1E88E5" size="48">mdi-chart-box-outline</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">تعداد کل بک‌تست‌ها</span>
              <span class="text-h6 font-weight-bold">{{ backTestStore.backtestInfo.total }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#28a745" size="36">mdi-finance</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">بک‌تست‌های سودآور</span>
              <span class="text-h6 font-weight-bold">{{ backTestStore.backtestInfo.profitable }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#F57C00" size="36">mdi-chart-areaspline</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">میانگین عملکرد</span>
              <span class="text-h6 font-weight-bold d-flex justify-end" dir="ltr">{{ NumberHelper.round2( backTestStore.backtestInfo.avgPercent ) }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

    </v-row>
    <v-row class="mt-5 mb-5" justify="center">
      <v-data-table-server
        v-model:items-per-page="backTestStore.pagination.itemsPerPage"
        class="custom-table"
        :headers="headers"
        item-key="id"
        :items="backTestStore.backtests"
        :items-length="backTestStore.totalItems"
        :page="backTestStore.pagination.page"
        show-current-page
        @update:items-per-page="backTestStore.setItemsPerPage"
        @update:page="backTestStore.setPage"
      >
        <template #item.index="{index}">
          {{ index+1 }}
        </template>


        <template #item.symbol="{ item }">
          <span class="font-weight-medium text-black-darken-3">
            {{ item?.symbol?.name }}
          </span>
        </template>


        <template #item.strategy="{ item }">
          <span class="font-weight-medium text-black-darken-3">
            {{ item?.strategy?.name }}
          </span>
        </template>

        <template #item.finalCapital="{ item }">
          <span class="font-weight-medium text-black-darken-3">
            {{ NumberHelper.round2( item.finalCapital) }}
          </span>
        </template>
        <template #item.type="{ item }">
          <v-chip
            class="d-flex justify-center align-center"
            :color="item.strategy?.signalType?.toUpperCase() === 'LONG' ? 'success' : item.strategy?.signalType?.toUpperCase() === 'SHORT' ? 'error' : 'grey'"
            size="small"
            text-color="white"
          >
            <v-icon class="me-2" left>
              {{ item.strategy?.signalType?.toUpperCase() === 'LONG'
                ? 'mdi-arrow-up-bold'
                : item.strategy?.signalType?.toUpperCase() === 'SHORT'
                  ? 'mdi-arrow-down-bold'
                  : 'mdi-help-circle-outline' }}
            </v-icon>
            {{ item.strategy?.signalType }}
          </v-chip>
        </template>
        <template #item.initialCapital="{ item }">

          {{ item.initialCapital }}

        </template>


        <template #item.totalProfit="{ item }" class="font-weight-medium">
          <span class="font-weight-medium" :class="item.finalCapital - item.initialCapital >= 0 ? 'text-success' : 'text-error' " dir="ltr">

            {{ formatReturnPercent(item.initialCapital, item.finalCapital) }}
            <v-icon>
              {{ item.finalCapital - item.initialCapital >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
            </v-icon>
          </span>
        </template>

        <template #item.winRate="{ item }">
          <span class="font-weight-medium text-black-darken-3">
            {{ calcWinRate(item.winTrades, item.totalTrades) }}
          </span>

        </template>
        <!--          <template #item.initialCapital="{ item }">
            <span
              class="font-weight-medium "
              :class="{
                'text-green-darken-2': item.initialCapital > 0,
                'text-red-darken-2': item.initialCapital < 0,
                'text-grey-darken-1': item.initialCapital === 0
              }"
            >
              {{ item.initialCapital }}
            </span>
          </template>-->
        <template #item.status="{ item }">
          <v-chip
            :color="item.status=== 'PENDING' ? 'orange':
              item.status=== 'RUNNING' ? 'blue':
              item.status=== 'COMPLETED' ? 'green':
              'red'"
            text-color="white"
          >
            {{
              item.status === 'PENDING' ? 'در صف اجرا' :
              item.status === 'RUNNING' ? 'در حال اجرا' :
              item.status === 'COMPLETED' ? 'اتمام یافته' :
              'خطا'
            }}
          </v-chip>
        </template>

        <template #item.chart="{ item }">
          <v-btn class="chart" @click="showChart(item.id)">
            <span class="font-weight-medium text-blue-darken-3">نمایش چارت</span>
          </v-btn>
        </template>

      </v-data-table-server>
    </v-row>
  </v-card>


</template>
<style scoped lang="scss">
.chart{
  border: 1px solid #0047ff;/* حاشیه نارنجی */
background-color: #f3fdff
}
.custom-table {
  width: 95%;
  background-color: #ffffff;         /* زمینه جدول سفید */
  border-radius: 16px;               /* لبه‌های گرد */
  overflow: hidden;
  border: 2px solid #dcdcdc;/* حاشیه نارنجی */
}

/* جدول هدر */
.custom-table ::v-deep th {
  background-color: #fdf1f1 !important; /* رنگ هدر */
  border-bottom: 1px solid #000000;    /* جداکننده هدر */
  text-align: center;
  padding: 12px;
}

/* جدول سلول‌ها */
.custom-table ::v-deep td {
  background-color: #ffffff;
  height: 60px;
  border-bottom: 1px solid #b5b5b5; /* جداکننده ردیف‌ها */
  text-align: center;
  padding: 12px;

}

/* آخرین ردیف border-bottom نداشته باشه */
.custom-table ::v-deep tr:last-child td {


}
.home-page{
  background-color: #fffcfc !important;
  min-height: 100vh;
}
.table-wrapper{
  display: flex;
  justify-content: center;

}
</style>
