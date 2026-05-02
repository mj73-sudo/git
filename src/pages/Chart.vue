<script setup lang="ts">
  import { Line } from 'vue-chartjs'
  import { useChartStore } from '../stores/ChartStore.ts'
  import { onMounted } from 'vue';
  import {
    CategoryScale,
    Chart as ChartJS, type ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
  } from 'chart.js'

  import { formatJalaliDate } from '../components/Jalali.ts'
  import { BacktestStore } from '../stores/Backtest.ts';
  import { useBackTest } from '../stores/Responseback.ts';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
  )

  const usechartstore = useChartStore()

  const props = defineProps<{ id: string }>()
  const backtestStore= useBackTest();

  onMounted(() => {
    usechartstore.getChartData(props.id)
    backtestStore.getacktestShow(props.id);
    console.log(backtestStore.backtestsShow)
  })

  /* ---------- Crosshair Plugin ---------- */

  const crosshairPlugin = {
    id: 'crosshair',

    afterDraw (chart:any) {

      if (!chart.tooltip?._active?.length) return

      const ctx = chart.ctx
      const x = chart.tooltip._active[0].element.x
      const topY = chart.scales.y.top
      const bottomY = chart.scales.y.bottom

      ctx.save()

      ctx.beginPath()
      ctx.moveTo(x, topY)
      ctx.lineTo(x, bottomY)

      ctx.lineWidth = 1
      ctx.strokeStyle = '#999'
      ctx.setLineDash([5,5])
      ctx.stroke()

      ctx.restore()
    },
  }

  ChartJS.register(crosshairPlugin)

  /* ---------- Chart Data ---------- */

  const chartData = computed(() => {

    const values = usechartstore.dataChart.value ?? []
    const lastIndex = values.length - 1

    return {

      labels: (usechartstore.dataChart.label ?? []).map(d =>
        formatJalaliDate(d)
      ),

      datasets: [

        {
          label: `نتایج بک تست ${usechartstore.dataChart.symbol}`,
          data: values,

          borderColor: '#2962FF',

          backgroundColor: (context:any) => {

            const chart = context.chart
            const { ctx, chartArea } = chart

            if (!chartArea) return null

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            )

            gradient.addColorStop(0, 'rgba(41,98,255,0.35)')
            gradient.addColorStop(1, 'rgba(41,98,255,0.02)')

            return gradient
          },

          fill: true,

          borderWidth: 3,

          tension: 0.45,

          pointRadius: (ctx:any) =>
            ctx.dataIndex === lastIndex ? 6 : 0,

          pointHoverRadius: 8,

          pointBackgroundColor: '#2962FF',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,

        },

      ],

    }
  })

  /* ---------- Options ---------- */

  const chartOptions: ChartOptions<'line'> = {

    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: 'index',
      intersect: false,
    },

    animation: {
      duration: 800,
    },

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: '#1E1E2F',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,

        callbacks: {
          label: context => {
            return `سرمایه: ${context.raw}`
          },
        },
      },

    },

    scales: {

      x: {
        grid: { display: false },
        ticks: { color: '#666' },
      },

      y: {
        grid: { color: '#eeeeee' },
        ticks: { color: '#666' },
      },

    },

  }
</script>

<template>


  <!--    <v-row class="d-flex mx-auto justify-center mt-7" style="width: 96%;">
      <v-col cols="12" md="3">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            &lt;!&ndash; آیکون &ndash;&gt;
            <v-col>
              <v-icon color="#1E88E5" size="48">mdi-chart-box-outline</v-icon>
            </v-col>
            &lt;!&ndash; متن و عدد &ndash;&gt;
            <v-col>
              <span class="text-subtitle-1 font-weight-medium">{{backtestStore.backtestsShow.initialCapital}}</span>
            </v-col>
          </v-row>


          <v-row align="center" no-gutters>
            &lt;!&ndash; آیکون &ndash;&gt;
            &lt;!&ndash; متن و عدد &ndash;&gt;
            <v-col cols="12" md="12" class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">تعداد کل بک‌تست‌ها</span>
            </v-col>
            <v-col cols="12" md="12" class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">تعداد کل بک‌تست‌ها</span>
            </v-col>
            <v-col cols="12" md="12" class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">تعداد کل بک‌تست‌ها</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            &lt;!&ndash; آیکون &ndash;&gt;
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#28a745" size="36">mdi-finance</v-icon>
            </v-col>

            &lt;!&ndash; متن و عدد &ndash;&gt;
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">بک‌تست‌های سودآور</span>
              <span class="text-h6 font-weight-bold">54</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            &lt;!&ndash; آیکون &ndash;&gt;
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#F57C00" size="36">mdi-chart-areaspline</v-icon>
            </v-col>

            &lt;!&ndash; متن و عدد &ndash;&gt;
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">میانگین عملکرد</span>
              <span class="text-h6 font-weight-bold">8788</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-3" elevation="5" rounded="xl">
          <v-row align="center" no-gutters>
            &lt;!&ndash; آیکون &ndash;&gt;
            <v-col class="d-flex align-center me-2" cols="auto">
              <v-icon color="#1E88E5" size="48">mdi-chart-box-outline</v-icon>
            </v-col>

            &lt;!&ndash; متن و عدد &ndash;&gt;
            <v-col class="d-flex flex-column justify-center">
              <span class="text-subtitle-1 font-weight-medium">تعداد کل بک‌تست‌ها</span>
              <span class="text-h6 font-weight-bold">54545</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>-->
  <v-container class="mt-3  d-flex justify-center align-center">
    <v-card class="mt-8 mb-8 pa-2 d-flex justify-center align-center" width="100%">
      <div
        v-if="usechartstore.dataChart.label?.length"
        style="height:500px;width:100%"
      >

        <Line
          :data="chartData"
          :options="chartOptions"
        />

      </div>

    </v-card>
  </v-container>

</template>


<!--
<script setup lang="ts">
  import { Line } from 'vue-chartjs'
  import { useChartStore } from '../stores/ChartStore.ts'
  import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
  } from 'chart.js'
  import { formatJalaliDate } from '../components/Jalali.ts'
  import { computed, onMounted } from 'vue'

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

  const usechartstore = useChartStore()
  const props = defineProps<{ id: string }>()

  onMounted(() => {
    usechartstore.getChartData(props.id)
  })
  computed(() => usechartstore.dataChart.value?.length ? usechartstore.dataChart.value.length - 1 : 0);
  const chartData = computed(() => ({
    labels: (usechartstore.dataChart.label ?? []).map(data => formatJalaliDate(data)) ?? [],
    datasets: [
      {
        label: `نتایج بک تست ${usechartstore.dataChart.symbol}`,
        data: usechartstore.dataChart.value ?? [],
        borderColor: '#1E1E2F',
        backgroundColor: '#1E1E2F',
        tension: 0.4,
      },
    ],
  }))

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { mode: 'index', intersect: false },
      legend: { position: 'bottom' },
    },
  }
</script>

<template>
  <div class="d-flex justify-center mt-8" style="width: 100%;">
    <div v-if="usechartstore.dataChart.label && usechartstore.dataChart.label.length > 0" style="height: 300px; width: 65%;">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
-->
