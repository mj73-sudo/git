// useJalali.ts
import dayjs from 'dayjs'
import 'dayjs/locale/fa'

export function formatJalaliDate (date: string | Date, format = 'YYYY/MM/DD') {
  if (!date) return ''
  return dayjs(date).locale('fa').format(format)
}
