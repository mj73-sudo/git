<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { ListSignalStore } from '../stores/Signal.ts'

  // دسترسی به store
  const signalstore = ListSignalStore()
  import JalaliDate from '../components/JalaliDate.vue'
  import type { DataTableHeader } from 'vuetify/framework';
  import { AuthStore } from '../stores/auth.ts';

  // ستون‌های جدول
  const headers: DataTableHeader[] = [
    { key: 'index', title: 'ردیف', align: 'center' },
    { key: 'symbol', title: 'نام سیمبل', align: 'center' },
    { key: 'signalType', title: 'نوع سیگنال', align: 'center' },
    { key: 'strategy', title: 'نام استراتژی', align: 'center' },
    { key: 'signalTime', title: 'تاریخ سیگنال', align: 'center' },
    { key: 'price', title: 'قیمت', align: 'center' },
    /*
    { key: 'delete', title: 'حذف', align: 'center' },
*/
  ];

  // حذف یک آیتم از جدول
  /*
  const removeCondition = (index: number) => {
    signalstore.listsignal.splice(index, 1)
  }
*/

  const selectedIndex = ref<number | null>(null)
  const showdefinetly = ref<boolean>(false);
  const firstLogin=ref<boolean>(true);

  const removeCondition = (index: number) => {
    selectedIndex.value = index
    showdefinetly.value = true
  }
  const run = async () => {
    if (selectedIndex.value !== null) {
      signalstore.deleteSignal(selectedIndex.value)
      selectedIndex.value = null
    }
    showdefinetly.value = false
  }

  const close =()=>{
    showdefinetly.value=false;
  }

  const authstore= AuthStore();
  // بارگذاری داده‌ها بعد از mount
  onMounted(async () => {
    await signalstore.fetchItems();
    await signalstore.getsignalInfo();
    await authstore.getUser();

  })

  function closeTrain (){
    firstLogin.value=false;
  }

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
              <v-icon color="#007bff" size="36">mdi-chart-line</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">تعداد کل سیگنال</span>
              <span class="text-h6 font-weight-bold">{{ signalstore?.signalInfo?.total }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#28a745" size="36">mdi-trending-up</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">سیگنال‌های خرید</span>
              <span class="text-h6 font-weight-bold">{{ signalstore?.signalInfo?.totalLong }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#dc3545" size="36">mdi-trending-down</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">سیگنال‌های فروش</span>
              <span class="text-h6 font-weight-bold">{{ signalstore?.signalInfo?.totalShort }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

    </v-row>
    <v-row class="mt-5 mb-5" justify="center">
      <v-data-table-server
        v-if="signalstore.listsignal.length > 0"
        v-model:items-per-page="signalstore.pagination.itemsPerPage"
        class="custom-table"
        :headers="headers"
        item-key="id"
        :items="signalstore.listsignal"
        :items-length="signalstore.totalItems"
        :page="signalstore.pagination.page"
        show-current-page
        style="text-align-last: center"
        @update:items-per-page="signalstore.setItemsPerPage"
        @update:page="signalstore.setPage"
      >

        <template #item.index="{ index }">
          <div>{{ index + 1 }}</div>
        </template>

        <template #item.symbol="{ item }">
          <p class="font-weight-semibold"> {{ item.symbol?.name }}</p>
        </template>
        <template #item.strategy="{ item }">
          <p class="font-weight-semibold">    {{ item.strategy?.name }}</p>
        </template>
        <template #item.price="{ item }">
          <p class="font-weight-semibold">    {{ item.price }}</p>
        </template>
        <template #item.signalType="{ item }">
          <v-chip
            class=" justify-center align-center pa-3"
            :color="item.signalType?.toUpperCase() === 'LONG' ? '#5bae18' : item.signalType?.toUpperCase() === 'SHORT' ? 'error' : 'grey'"
            size="small"
            text-color="white"
          >
            <v-icon class="me-3">
              {{ item.signalType?.toUpperCase() === 'LONG'
                ? 'mdi-arrow-up-bold'
                : item.signalType?.toUpperCase() === 'SHORT'
                  ? 'mdi-arrow-down-bold'
                  : 'mdi-help-circle-outline' }}
            </v-icon>
            {{ item.signalType }}
          </v-chip>
        </template>


        <template #item.signalTime="{ item }">
          <div class="d-flex align-center justify-center w-100" style="direction: rtl;">
            <v-icon class="me-2" color="red" size="18">mdi-clock-outline</v-icon>
            <span class="time-text">
              <JalaliDate :ago="true" :date="item.signalTime" />
            </span>
          </div>
        </template>


        <!--        <template #item.delete="{ index }">
          <v-icon class="cursor-pointer align-center" color="red" @click="removeCondition(index)">
            mdi-delete
          </v-icon>
        </template>-->
      </v-data-table-server>
      <!-- پیام وقتی داده خالیه -->
      <div v-else class="text-center text-grey py-6">
        هیچ سیگنالی وجود ندارد.
      </div>
    </v-row>
  </v-card>

  <v-dialog
    v-model="showdefinetly"
    max-width="450"
    persistent
  >
    <v-card class="pa-6 rounded-xl">

      <!-- عنوان و آیکون -->
      <div class="d-flex align-center mb-4">
        <v-icon class="me-3" color="red" size="32">mdi-alert-circle</v-icon>
        <span class="text-h6 font-weight-bold">
          تأیید حذف
        </span>
      </div>
      <!-- متن وسط چین و زیبا -->
      <v-card-text class="text-body-1 text-center mb-6" style="font-family: 'Shabnam', sans-serif">
        آیا از حذف این مورد کاملاً مطمئن هستید؟<br>
        این عملیات قابل بازگشت نیست.
      </v-card-text>

      <!-- دکمه‌ها -->
      <v-row align="center" class="mt-2" justify="center">
        <v-col cols="12" md="6" sm="2">
          <v-btn
            block
            class="text-white rounded-lg"
            color="red"
            size="large"
            @click="run"
          >
            حذف
          </v-btn>
        </v-col>

        <v-col cols="12" md="6" sm="2">
          <v-btn
            block
            class="rounded-lg"
            color="grey"
            size="large"
            variant="tonal"
            @click="close"
          >
            انصراف
          </v-btn>
        </v-col>
      </v-row>

    </v-card>
  </v-dialog>

</template>

<style scoped lang="scss">
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
.time-text {
  min-width: 90px;   /* مهم‌ترین خط */
  text-align: right;
  display: inline-block;
}
</style>
