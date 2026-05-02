<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useDashboardStore } from '../stores/DashboardStore.ts';
  import { NumberHelper } from '../components/NumberHelper.ts';
  import { AuthStore } from '../stores/auth.ts';
  import type { DataTableHeader } from 'vuetify';
  import JalaliDate from '../components/JalaliDate.vue';
  import { ListSignalStore } from '../stores/Signal.ts';
  import { useStrategyStore } from '../stores/Strategy.ts';


  const dashboardStore=useDashboardStore();
  const authstore= AuthStore();
  const listSgnalStore=ListSignalStore();
  const  strategystore = useStrategyStore();

  onMounted(async ()=>{
    await strategystore.fetchItems();
    await  dashboardStore.getOverview();
    await dashboardStore.getTopStrategy();
    await listSgnalStore.getListSignal();

  })



  const TopStrategyModel = computed(() => [
    {
      title: 'نام استراتژی',
      value: 'TopStrategyModel.value.namee',
      icon: 'mdi-robot',
    },
    {
      title: 'درصد سود',
      value:' TopStrategyModel.value.profitPercentage',
      icon: 'mdi-cash-multiple',
    },
    {
      title: 'وین ریت',
      value: 'TopStrategyModel.value.winRate ',
      icon: 'mdi-target',
    },
  ]);

  const header: DataTableHeader[] = [
    { key: 'index', title: 'ردیف', align: 'center' },
    { key: 'symbol', title: 'نام سیمبل', align: 'center' },
    { key: 'signalType', title: 'نوع سیگنال', align: 'center' },
    { key: 'strategy', title: 'نام استراتژی', align: 'center' },
    { key: 'signalTime', title: 'تاریخ سیگنال', align: 'center' },
    { key: 'price', title: 'قیمت', align: 'center' },
  ];
  // بارگذاری داده‌ها بعد از mount
  function seeTrain (){
    authstore.newUser=false;
  }
  function closeTrain (){
    authstore.newUser=false;
  }


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
  const lastThree = computed(() => {
    return strategystore.strategies.slice(-3)
  })
  const l =ref(true)

</script>

<template>

  <v-card-title class="mb-0 mt-5">
    <v-row cols="12">
      <v-col cols="8">
        <v-icon class="ml-2" size="20">mdi-finance</v-icon>
        <span class="text-sm-body-1">داشبورد آرازکریپتو</span>
      </v-col>
      <v-col class="d-flex justify-end" cols="4" />
    </v-row>
  </v-card-title>
  <v-row class="d-flex mx-auto justify-center" style="width: 96%;">
    <v-col cols="12" md="3">
      <v-card class="pa-3 pr-7 " elevation="5" rounded="xl">
        <v-row align="center" no-gutters>
          <!-- آیکون -->
          <v-col class="d-flex align-center me-2" cols="auto">
            <div class="icon-circle md primary">
              <v-icon color="#ffffff" size="30">mdi-finance</v-icon>
            </div>
          </v-col>

          <!-- متن و عدد -->
          <v-col class="d-flex flex-column justify-center pr-3 ">
            <span class="alert-text--sm">کل سود</span>
            <span class="text-h6 font-weight-bold pt-3 justify-end d-flex" dir="ltr">{{ NumberHelper.round2(dashboardStore.stats.totalProfit) }}
            </span>
          </v-col>
        </v-row>
      </v-card>
    </v-col>


    <v-col cols="12" md="3">
      <v-card class="pa-3 pr-7 " elevation="5" rounded="xl">
        <v-row align="center" no-gutters>
          <!-- آیکون -->
          <v-col class="d-flex align-center me-2" cols="auto">
            <div class="icon-circle md success">
              <v-icon color="#ffffff" size="30">mdi-bullseye</v-icon>
            </div>
          </v-col>

          <!-- متن و عدد -->
          <v-col class="d-flex flex-column justify-center pr-3 ">
            <span class="alert-text--sm">نرخ برد</span>
            <span class="text-h6 font-weight-bold pt-3">{{ NumberHelper.round2(dashboardStore.stats.winRate) }}
            </span>
          </v-col>
        </v-row>
      </v-card>
    </v-col>


    <v-col cols="12" md="3">
      <v-card class="pa-3 pr-7 " elevation="5" rounded="xl">
        <v-row align="center" no-gutters>
          <!-- آیکون -->
          <v-col class="d-flex align-center me-2" cols="auto">
            <div class="icon-circle md error">
              <v-icon color="#ffffff" size="30">mdi-lightbulb-on-outline</v-icon>
            </div>
          </v-col>

          <!-- متن و عدد -->
          <v-col class="d-flex flex-column justify-center pr-3 ">
            <span class="alert-text--sm">استراتژی فعال</span>
            <span class="text-h6 font-weight-bold pt-3">{{ NumberHelper.round2(dashboardStore.stats.activeStrategies) }}
            </span>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-col cols="12" md="3">
      <v-card class="pa-3 pr-7 " elevation="5" rounded="xl">
        <v-row align="center" no-gutters>
          <!-- آیکون -->
          <v-col class="d-flex align-center me-2" cols="auto">
            <div class="icon-circle md orange">
              <v-icon color="#ffffff" size="30">mdi-bell-ring</v-icon>
            </div>
          </v-col>

          <!-- متن و عدد -->
          <v-col class="d-flex flex-column justify-center pr-3 ">
            <span class="alert-text--sm">سیگنال های روز</span>
            <span class="text-h6 font-weight-bold pt-3">{{ NumberHelper.round2(dashboardStore.stats.todaySignals) }}
            </span>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  <!--لیست اخرین سیگنالها-------------------------------------------  -->

  <v-row class="d-flex mx-auto justify-center">
    <v-col cols="12" md="8">
      <v-card elevation="5" rounded="xl">
        <!--
        <v-data-table-server
          v-if="listSgnalStore.listsignal.length > 0"
          v-model:items-per-page="listSgnalStore.pagination.itemsPerPage"
          class="custom-table"
          :headers="headers"
          item-key="id"
          :items="listSgnalStore.listsignal"
          :items-length="listSgnalStore.totalItems"
          :page="listSgnalStore.pagination.page"
          show-current-page
          style="text-align-last: center"
          @update:items-per-page="listSgnalStore.setItemsPerPage"
          @update:page="listSgnalStore.setPage"
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


          &lt;!&ndash;        <template #item.delete="{ index }">
            <v-icon class="cursor-pointer align-center" color="red" @click="removeCondition(index)">
              mdi-delete
            </v-icon>
          </template>&ndash;&gt;
        </v-data-table-server>
-->
        <list-chart id="5" />
        <!--        <v-data-table-server-->
        <!--          v-model:items-per-page="strategystore.pagination.itemsPerPage"-->
        <!--          class="custom-table"-->
        <!--          elevation="8"-->
        <!--          :headers="headers"-->
        <!--          item-key="id"-->
        <!--          :items="lastThree"-->
        <!--          :items-length="3"-->
        <!--          :page="1"-->
        <!--          show-current-page-->
        <!--        >-->
        <!--          <template #item.index="{ index }">-->
        <!--            <div>{{ index + 1 }}</div>-->
        <!--          </template>-->
        <!--          <template #item.name="{ item }">-->
        <!--            <v-badge-->
        <!--              v-if="item.badge"-->
        <!--              color="deep-orange"-->
        <!--              :content="item.badge"-->
        <!--              location="right top"-->
        <!--              offset-y="-20"-->
        <!--              style="direction: rtl"-->
        <!--            />-->
        <!--            <span class="font-weight-semibold pr-5">-->
        <!--            {{ item.name }}-->
        <!--          </span>-->
        <!--          </template>-->


        <!--          <template #item.signalType="{ item }">-->
        <!--            <v-chip-->
        <!--              class="d-flex justify-center align-center"-->
        <!--              :color="item.signalType?.toUpperCase() === 'LONG' ? 'success' : item.signalType?.toUpperCase() === 'SHORT' ? 'error' : 'grey'"-->
        <!--              size="small"-->
        <!--              text-color="white"-->
        <!--            >-->
        <!--              <v-icon class="me-2" left>-->
        <!--                {{ item.signalType?.toUpperCase() === 'LONG'-->
        <!--                ? 'mdi-arrow-up-bold'-->
        <!--                : item.signalType?.toUpperCase() === 'SHORT'-->
        <!--                  ? 'mdi-arrow-down-bold'-->
        <!--                  : 'mdi-help-circle-outline' }}-->
        <!--              </v-icon>-->
        <!--              {{ item.signalType }}-->
        <!--            </v-chip>-->
        <!--          </template>-->


        <!--          <template #item.conditions="{ item }">-->
        <!--            <v-chip-->
        <!--              color="deep-purple"-->
        <!--              size="small"-->
        <!--              text-color="white"-->
        <!--            >-->
        <!--              {{ item.conditions ? item.conditions.length : '' }} شرط-->
        <!--            </v-chip>-->
        <!--          </template>-->

        <!--          <template #item.status="{ item }">-->
        <!--            <v-row>-->
        <!--              <v-col cols="12" md="3"><v-icon-->
        <!--                :color="item.active ? '#ff8f03' : '#ff8f03'"-->
        <!--                @click="onStatus(item)"-->
        <!--              >-->
        <!--                {{ item.active ?'mdi-check-circle' :'mdi-help-circle-outline' }}-->
        <!--              </v-icon></v-col>-->


        <!--              <v-col cols="12" md="3"><v-icon-->
        <!--                color="red"-->
        <!--                @click="DuplicteStrategy(item.id)"-->
        <!--              >-->
        <!--                mdi-repeat-->
        <!--              </v-icon></v-col>-->

        <!--              <v-col cols="12" md="3"><v-icon-->
        <!--                color="red"-->
        <!--                @click="onDeleteStrategy(item.id)"-->
        <!--              >-->
        <!--                mdi-delete-->
        <!--              </v-icon></v-col>-->

        <!--              <v-col cols="12" md="3"> <v-icon class="cursor-pointer align-center" color="green" @click="openBacktestDialog(item)">-->
        <!--                mdi-play-->
        <!--              </v-icon></v-col>-->
        <!--            </v-row>-->
        <!--          </template>-->
        <!--          <template #item.run="{ item }">-->
        <!--            <v-icon class="cursor-pointer align-center" color="green" @click="openBacktestDialog(item)">-->
        <!--              mdi-play-->
        <!--            </v-icon>-->

        <!--          </template>-->
        <!--          <template #item.winRate="{ item }">-->

        <!--            <p class="font-weight-semibold"> {{ NumberHelper.round2( item.winRate ) }}</p>-->

        <!--          </template>-->

        <!--          <template #item.totalTrades="{ item }">-->
        <!--            {{ item.totalBackTest }}-->
        <!--          </template>-->

        <!--          <template #item.date="{ item }">-->

        <!--            <p class="font-weight-thin" dir="ltr">-->
        <!--              <jalali-date :date="item.createdDate" format="YYYY/MM/DD" />-->
        <!--            </p>-->

        <!--          </template>-->

        <!--        </v-data-table-server>-->

      </v-card>

    </v-col>

    <!--برترین های استراتژی-------------------------------------------  -->

    <v-col cols="12" md="4">
      <v-card elevation="5" rounded="xl">
        <v-card-title>
          <v-row cols="12">
            <v-col cols="8">
              <span class="font-weight-medium">برترین های استراتژی ها</span>
            </v-col>
            <v-col class="d-flex justify-end" cols="4" />
          </v-row>
        </v-card-title>
        <v-container class="pr-4">
          <v-row
            v-for="(item,i) in dashboardStore.topStrategies"
            :key="i"
            align="center"
            class="mb-2"
            no-gutters
          >
            <!-- آیکون -->
            <v-col class="d-flex align-center me-2" cols="auto">
              <div
                class="icon-circle sm "
                :style="
                  { backgroundColor:item.winRate<=30
                    ?'red': item.winRate<=50
                      ?'orange':item.winRate>50
                        ?'green':'blue'}
                "
              >
                <v-icon size="25"> {{ `mdi-numeric-${i + 1}` }}</v-icon>
              </div>
            </v-col>

            <!-- متن و عدد -->
            <v-col class="d-flex flex-column justify-center pr-3">
              <span class="font-weight-bold" style="font-family: 'Shabnam', sans-serif">{{ item.name }}</span>

              <span class="text-medium-emphasis">
                نرخ برد : {{ NumberHelper.round2(item.winRate) }}% |
                سود : {{ NumberHelper.round2(item.profitPercentage) }}


              </span>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>


  <BaseDialog
    v-model="authstore.newUser"
    action-size="large"
    cancel-text=" بیخیال شروع می‌کنم"
    confirm-color="red"
    confirm-text=" دیدن آموزش ۲۰ ثانیه‌ای"
    text=" اولین باره وارد شدی!
        برای شروع سریع‌تر، چند استراتژی آماده برات گذاشتیم.
        صفحه رو ببین و اولین بک‌تستتو اجرا کن."
    title="خوش اومدی به آرازکریپتو!"
  />

<!--
  <v-dialog

    v-model="l"
    max-width="520"
    persistent
  >
    <v-card
      class="pa-8 rounded-xl"
      elevation="12"
      style="
      border-radius: 18px;
      overflow: hidden;
      backdrop-filter: blur(20px);
    "
    >


      &lt;!&ndash; Title &ndash;&gt;
      <div
        class="d-flex align-center justify-center mb-3"
        style="gap: 12px;"
      >
        <v-icon color="red" size="45">mdi-hand-wave</v-icon>

        <span
          class="text-h5 font-weight-bold"
          style="font-family: 'Shabnam', sans-serif;"
        >
          خوش اومدی به آرازکریپتو!
        </span>
      </div>


      &lt;!&ndash; Subtext &ndash;&gt;
      <v-card-text
        class="text-center mb-6"
        style="
        font-family: 'Shabnam', sans-serif;
        font-size: 1.05rem;
        color: #555;
        line-height: 1.9;
      "
      >
        اولین باره وارد شدی!
        برای شروع سریع‌تر، چند استراتژی آماده برات گذاشتیم.
        صفحه رو ببین و اولین بک‌تستتو اجرا کن.
      </v-card-text>

      &lt;!&ndash; Buttons &ndash;&gt;
      <v-row class="mt-2" dense justify="center">
        <v-col cols="12" sm="6">
          <v-btn
            block
            class="text-white py-4 rounded-lg"
            color="deep-orange"
            size="large"
            style="font-family: 'Shabnam'; font-size: 1.1rem;"
            @click="seeTrain"
          >
            دیدن آموزش ۲۰ ثانیه‌ای
          </v-btn>
        </v-col>

        <v-col cols="12" sm="6">
          <v-btn
            block
            class="py-4 rounded-lg"
            color="deep-orange"
            size="large"
            style="font-family: 'Shabnam'; font-size: 1.1rem;"
            variant="tonal"
            @click="closeTrain"
          >
            بیخیال شروع می‌کنم
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
-->

</template>

<style scoped lang="scss">


</style>
