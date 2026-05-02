// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/locale'

export const myFa = {
  ...fa,
  dataTable: {
    ...fa.dataTable,
    itemsPerPageText: 'تعداد در هر صفحه',
    ariaLabel: {
      ...fa.dataTable.ariaLabel,
      sortDescending: 'مرتب‌سازی نزولی',
      sortAscending: 'مرتب‌سازی صعودی',
      sortNone: 'بدون مرتب‌سازی',
    },
  },
  VTextField: {
    clear: 'پاک کردن',
  },
}

export default createVuetify({
  locale: {
    locale: 'fa',
    messages: { fa: myFa },
    rtl: {
      fa: true,
    },
  },

  defaults: {
    style: {
      fontFamily: 'Shabnam, sans-serif',
    },
  },

  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          background: '#F9FAFB',
          surface: '#ffffff',
          primary: '#FF8C00',
          secondary: '#3B82F6',
          success: '#10B981',
          error: '#EF4444',
          info: '#3B82F6',
          warning: '#F59E0B',
          textPrimary: '#111827',
          textSecondary: '#6B7280',
        },
      },
      darkTheme: {
        dark: true,
        colors: {
          background: '#0B0C10',
          surface: '#1E1E2F',
          primary: '#4CAF50',
          secondary: '#3B82F6',
          success: '#10B981',
          error: '#EF4444',
          info: '#3B82F6',
          warning: '#F59E0B',
          'on-surface': '#E6E7EA',
        },
      },
    },
  },

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})
