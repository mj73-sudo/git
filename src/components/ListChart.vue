<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import {
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
  } from 'chart.js';

  // رجیستر کردن اجزاء مورد نیاز
  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend
  );

  const chartRef = ref<HTMLCanvasElement | null>(null);
  let chart: Chart | null = null;

  onMounted(() => {
    if (!chartRef.value) return;

    const ctx = chartRef.value.getContext('2d');
    if (!ctx) return;

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
        datasets: [
          {
            label: 'تعداد استراتژی‌های فعال',
            data: [5, 9, 7, 12, 10, 14, 18],
            borderColor: '#2cb63d',
            backgroundColor: 'rgba(59,130,246,0.15)',
            tension: 0.3, // صاف بودن خط
            fill: true, // رنگ زیر خط
            pointRadius: 4,
            pointBackgroundColor: '#0a5e04',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                family: 'Shabnam, sans-serif',
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 2,
              font: {
                family: 'Shabnam, sans-serif',
              },
            },
          },
        },
      },
    });
  });
</script>

<template>
  <div style="height: 380px;">
    <canvas ref="chartRef" />
  </div>
</template>
