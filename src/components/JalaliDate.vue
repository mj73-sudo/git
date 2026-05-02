<template>
  <span>{{ formatted }}</span>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import dayjs from 'dayjs'
  import jalaliday from 'jalaliday'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import 'dayjs/locale/fa'

  dayjs.extend(jalaliday)
  dayjs.extend(relativeTime)
  dayjs.locale('fa')

  const props = defineProps<{
    date: string | Date | undefined
    format?: string
    ago?: boolean
  }>()

  const formatted = computed(() => {
    if (!props.date) return ''

    const dateObj = typeof props.date === 'string'
      ? new Date(props.date)
      : props.date

    if (props.ago) {
      return dayjs(dateObj).fromNow()
    }

    return dayjs(dateObj)
      .calendar('jalali')
      .format(props.format ?? 'YYYY/MM/DD')
  })


</script>
