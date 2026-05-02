<script setup lang="ts">

  import { useStrategyStore } from '../stores/Strategy.ts'
  import { SymbolStore } from '../stores/Symbol.ts';
  import { SymbolModel } from '../models/SymbolModel.ts';
  import { BacktestModel } from '../models/BacktestModel.ts';
  import { StrategyModel } from '../models/StrategyModel.ts';
  import { BacktestStore } from '../stores/Backtest.ts';
  import { onMounted, ref } from 'vue';
  import type { FieldDefinition } from '../models/FieldDefinition.Model.ts';
  import { NumberHelper } from '../components/NumberHelper.ts';
  import { ActiveModel } from '../models/ActiveModel.ts';
  import {DuplicateModel} from "../models/Duplicate.ts";
  import router from "../router";

  const symbolstore = SymbolStore();
  const backteststore = BacktestStore()

  const symbolmodel = ref<SymbolModel|null>(new SymbolModel())
  const dialog = ref<boolean>(false);
  const isformValid = ref<boolean>(false);
  const strategystore = useStrategyStore();

  const headers = [
    { key: 'index', title: 'ردیف', align: 'center' as const },
    { key: 'name', title: 'نام استراتژی', align: 'center' as const },
    { key: 'signalType', title: 'نوع سیگنال', align: 'center' as const },
    { key: 'conditions', title: 'تعداد شروط', align: 'center' as const },
    { key: 'winRate', title: 'نرخ موفقیت', align: 'center' as const },
    { key: 'totalTrades', title: 'کل معاملات', align: 'center' as const },
    { key: 'date', title: 'تاریخ', align: 'center' as const },
    { key: 'status', title: 'عملیات', align: 'center' as const },


  ]

  onMounted(async () => {
    await strategystore.fetchItems();
    await symbolstore.getSymbol();
    await strategystore.getStategyinfo();

  })
  //delete------------------------------------------------------------------------
  const showDialogDelete= ref<boolean>(false);
  const deleten = ref<number | null>(null) ;
  function onDeleteStrategy (id: number) {
    deleten.value=id
    showDialogDelete.value=true
    /*    if(id !=null)
      strategystore.deleteStrategy(id);*/
  }

  function deleteStrategy (){
    if(deleten.value !=null)
      strategystore.deleteStrategy(deleten.value);
    showDialogDelete.value=false
  }
  function closeDialog (){
    showDialogDelete.value=false
  }


  //Duplicate--------------------------------------------------------------------
  const duplicteModel=ref<DuplicateModel>(new DuplicateModel());
  function DuplicteStrategy (item:StrategyModel){
    duplicteModel.value.strategyId=item.id
    strategystore.duplicateStrategy(duplicteModel.value);
  }

  //EditStrategy--------------------------------------------------------------------
  function EditStrategy (item?: string | number) {
    if (!item && item !== 0) return;
    router.push({ path: `/strategy/${item}` });
  }


  //backtest------------------------------------------------------------------------
  function openBacktestDialog (item: StrategyModel) {
    dialog.value = true;
    backtestmodel.value.strategyId = item.id;
    symbolmodel.value =null;
  }

  const run = async () => {
    await backteststore.CreateBacktest(backtestmodel.value)
    backtestmodel.value = new BacktestModel();
    // ⬅️ مهم‌ترین قسمت برای ریست کردن v-select
    console.log(backtestmodel.value);
    dialog.value = false;

  }
  const close =async () => {
    symbolmodel.value = null;
    dialog.value = false;
    backtestmodel.value=new BacktestModel();

  }
  const onRunBacktest = (symbol: number) => {
    backtestmodel.value.symbolId = symbol;
  }

  const timeFrame = [
    (value: number | undefined) => {
      if (!value) {
        return 'این فیلد الزامی است'
      }
      else if (value == 15) {
        return true
      }
      else if (value !== 15) {
        return 'فقط تایم‌ 15 فعال هست'
      }
      return true
    },
  ];

  // active strategy-----------------------------------------------------------------
  const allertStatus = ref (false);
  const strategyModel =ref<StrategyModel>(new StrategyModel());

/*
  const activeModel = new ActiveModel();
*/


  const onStatus=async (item:StrategyModel)=>{
    allertStatus.value=true;

    strategyModel.value=item;
/*    activeModel.strategyId=item.id;*/
/*
    activeModel.strategyId = item.id;
*/
  }
  const activeModel = new ActiveModel();
  const isActive= async ()=>{
    strategyModel.value.active=!strategyModel.value.active;

    /*strategystore.statusStrategy({ strategyId :strategyModel.value.id });*/
/*
    strategystore.statusStrategy({ strategyId :strategyModel.value.id });
*/

    activeModel.strategyId = strategyModel.value.id;

    strategystore.statusStrategy(activeModel);

    allertStatus.value=false;
    strategyModel.value=new StrategyModel();
  }

  const deActive= async ()=>{
    allertStatus.value=false;
    strategyModel.value=new StrategyModel();
  }
  //------------------------------------------------------------------------------
  const backtestmodel = ref<BacktestModel>(new BacktestModel());

  const fields: FieldDefinition<BacktestModel>[] = [

    {
      type: 'select',
      name: 'symbolId',
      title: 'نماد',
      items: symbolstore.symbols,
      itemTitle: 'name',
      itemValue: 'id',
      md: 12,
      rules: [
        (value: number | unknown) => !!value || 'این فیلد الزامی است',
      ],
    },
    {
      type: 'text',
      name: 'initialCapital',
      title: 'سرمایه اولیه',
      md: 12,
      rules: [
        (value: string|unknown) => !!value || 'سرمایه اولیه الزامی است',
        (value: string |unknown) => (!isNaN(Number(value)) && Number(value) > 0) || 'مقدار باید عدد مثبت باشد',
      ],
    },
    {
      type: 'select',
      name: 'resolution',
      title: 'تایم فریم',
      items: [{ name: 15, id: 15 }],
      itemTitle: 'name',
      itemValue: 'id',
      md: 12,
      rules: [
        (value: number | unknown) => !!value || 'انتخاب تایم فریم الزامی است',
      ],
    },
  ];
</script>

<template>

  <v-card class="pa-2 home-page " flat>
    <v-card-title class="mb-0 mt-5">
      <v-row cols="12">
        <v-col cols="8">
          <v-icon class="ml-2" size="20">mdi-finance</v-icon>
          <span class="text-sm-body-1">لیست استراتژی‌های من</span>
        </v-col>
        <v-col class="d-flex justify-end" cols="4" />
      </v-row>
    </v-card-title>

    <v-row class="d-flex mx-auto justify-center" style="width: 96%;">
      <v-col cols="12" md="4">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#007bff" size="36">mdi-chart-bar</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">کل استراتژی‌ها</span>
              <span class="text-h6 font-weight-bold">{{ strategystore.strategyInfos.total }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#28a745" size="36">mdi-arrow-up-bold</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">استراتژی‌های خرید</span>
              <span class="text-h6 font-weight-bold">{{ strategystore.strategyInfos.totalLong }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#dc3545" size="36">mdi-arrow-down-bold</v-icon>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">استراتژی‌های فروش</span>
              <span class="text-h6 font-weight-bold">{{ strategystore.strategyInfos.totalShort }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

    </v-row>

    <!--    <v-divider class="my-2" />-->
    <div class="table-wrapper mt-5">
      <v-data-table-server
        v-model:items-per-page="strategystore.pagination.itemsPerPage"
        class="custom-table"
        elevation="8"
        :headers="headers"
        item-key="id"
        :items="strategystore.strategies"
        :items-length="strategystore.totalItems"
        :page="strategystore.pagination.page"
        show-current-page
        @update:items-per-page="strategystore.setItemsPerPage"
        @update:page="strategystore.setPage"
      >
        <template #item.index="{ index }">
          <div>{{ index + 1 }}</div>
        </template>
        <template #item.name="{ item }">
          <v-badge
            v-if="item.badge"
            color="deep-orange"
            :content="item.badge"
            location="right top"
            offset-y="-20"
            style="direction: rtl"
          />
          <span class="font-weight-semibold pr-5">
            {{ item.name }}
          </span>
        </template>


        <template #item.signalType="{ item }">
          <v-chip
            class="d-flex justify-center align-center"
            :color="item.signalType?.toUpperCase() === 'LONG' ? 'success' : item.signalType?.toUpperCase() === 'SHORT' ? 'error' : 'grey'"
            size="small"
            text-color="white"
          >
            <v-icon class="me-2" left>
              {{ item.signalType?.toUpperCase() === 'LONG'
                ? 'mdi-arrow-up-bold'
                : item.signalType?.toUpperCase() === 'SHORT'
                  ? 'mdi-arrow-down-bold'
                  : 'mdi-help-circle-outline' }}
            </v-icon>
            {{ item.signalType }}
          </v-chip>
        </template>


        <template #item.conditions="{ item }">
          <v-chip
            color="deep-purple"
            size="small"
            text-color="white"
          >
            {{ item.conditions ? item.conditions.length : '' }} شرط
          </v-chip>
        </template>

        <template #item.status="{ item }">
          <v-row>
            <v-col cols="12" md="3"><v-icon
              :color="item.active ? 'green' : 'grey'"
              @click="onStatus(item)"
              size="32"
            >
              {{ item.active ?'mdi-toggle-switch' :'mdi-toggle-switch-off' }}
            </v-icon></v-col>


            <v-col cols="12" md="3"><v-icon
              color="black"
              @click="DuplicteStrategy(item)"
            >
              mdi-content-copy
            </v-icon></v-col>

            <v-col cols="12" md="2"><v-icon
              color="black"
              @click="EditStrategy(item.id)"
            >
              mdi-square-edit-outline
            </v-icon></v-col>

            <v-col cols="12" md="2"> <v-icon class="cursor-pointer align-center" color="green" @click="openBacktestDialog(item)">
              mdi-play-circle-outline
            </v-icon></v-col>

            <v-col cols="12" md="2"><v-icon
              color="red"
              @click="onDeleteStrategy(item.id)"
            >
              mdi-delete
            </v-icon></v-col>
          </v-row>
        </template>
        <template #item.run="{ item }">
          <v-icon class="cursor-pointer align-center" color="green" @click="openBacktestDialog(item)">
            mdi-play
          </v-icon>

        </template>
        <template #item.winRate="{ item }">

          <p class="font-weight-semibold"> {{ NumberHelper.round2( item.winRate ) }}</p>

        </template>

        <template #item.totalTrades="{ item }">
          {{ item.totalBackTest }}
        </template>

        <template #item.date="{ item }">

          <p class="font-weight-thin" dir="ltr">
            <jalali-date :date="item.createdDate" format="YYYY/MM/DD" />
          </p>

        </template>

      </v-data-table-server>

      <!--      <v-alert
        v-if="strategystore.totalItems === 0"
        class="mt-4"
        color="blue"
        type="info"
        variant="tonal"
      >
        هیچ استراتژی‌ای ثبت نشده است.
      </v-alert>-->


    </div>
  </v-card>

<!--
  <BaseDialog
    v-model="allertStatus"
    :title="strategyModel.active
    ? 'آیا از غیر فعال کردن مطمئن هستید؟'
    : 'آیا می‌خواهید استراتژی را فعال کنید؟'"

    :text="strategyModel.active
    ? 'این عملیات قابل بازگشت نیست. لطفاً قبل از تایید مطمئن شوید.'
    : 'این عملیات قابل بازگشت است. استراتژی پس از فعال شدن قابل استفاده خواهد بود.'"

    confirm-text="بله"
    cancel-text="خیر"
    :confirm-color="strategyModel.active ? 'error' : 'success'"
    cancel-color="grey"
    @confirm="isActive"
    @cancel="deActive"
  />
-->





  <v-dialog v-model="allertStatus" max-width="450" persistent>
    <v-card class="pa-6 elevation-12 text-center" style="background: linear-gradient(135deg, #ffffff, #fafafa);">
      <!-- آیکون هشدار / موفقیت -->
      <v-card-title class="justify-center d-flex align-center">
        <v-icon class="me-2" :color="strategyModel.active ? '#dc3545' : '#28a745'" size="36">
          {{ strategyModel.active ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline' }}
        </v-icon>
        <span class="text-h6 font-weight-bold" style="font-family: 'Shabnam', sans-serif;">
          {{ strategyModel.active ? 'آیا از غیر فعال کردن مطمئن هستید؟' : 'آیا می‌خواهید استراتژی را فعال کنید؟' }}
        </span>
      </v-card-title>

      <!--      <v-card-text class="mt-4"> &lt;!&ndash;:style="{ color: strategyModel.active ? '#dc3545' : '#28a745' }"&ndash;&gt;
        {{ strategyModel.active
          ? 'این عملیات قابل بازگشت نیست. لطفاً قبل از تایید مطمئن شوید.'
          : 'این عملیات قابل بازگشت است. استراتژی پس از فعال شدن قابل استفاده خواهد بود.' }}
      </v-card-text>-->

      <v-card-actions class="justify-center mt-6 gap-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-btn
              class="rounded-lg px-6"
              color="success"
              height="44"
              variant="elevated"
              width="100%"
              @click="isActive"
            >
              بله
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn
              class="rounded-lg px-6"
              color="error"
              height="44"
              variant="outlined"
              width="100%"
              @click="deActive"
            >
              خیر
            </v-btn>
          </v-col>
        </v-row>


      </v-card-actions>
    </v-card>
  </v-dialog>


  <v-container>
    <BaseDialog

      width="30%"
      v-model="dialog"
      title="انتخاب نماد"
      confirm-text="ثبت"
      cancel-text="بستن"
      confirm-color="#FF8C00"
      cancel-color="#9CA3AF"
      action-size="xl"
      @cancel="close"
      @confirm="run"
      icontext="mdi-update"

    >
      <v-form v-model="isformValid">
        <MainsForm v-model="backtestmodel" :fields="fields" />
      </v-form>
    </BaseDialog>

  </v-container>
  <v-dialog
    v-model="showDialogDelete"
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
      <v-card-text class="text-body-1 text-center mb-6">
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
            @click="deleteStrategy"
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
            @click="closeDialog"
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
  text-align: start;
  padding: 12px;


}

/* جدول سلول‌ها */
.custom-table ::v-deep td {
  background-color: #ffffff;
  height: 60px;
  border-bottom: 1px solid #b5b5b5; /* جداکننده ردیف‌ها */
  text-align: start;
  padding: 12px;


}

/* آخرین ردیف border-bottom نداشته باشه */
.custom-table ::v-deep tr:last-child td {

}
.home-page{
  background-color: #fdf7f7 !important;
  min-height: 100vh;

}
.table-wrapper{
  display: flex;
  justify-content: center;

}

table tbody tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
tbody tr:hover td {
  background-color: #f3f6ff !important;
  transition: background-color 0.2s ease;
  cursor: pointer;
}
.custom-table ::v-deep tbody tr:hover td {
  background-color: #f3f6ff !important; /* رنگ دلخواه */
  transition: background-color 0.25s ease;
  cursor: pointer;
}
</style>
