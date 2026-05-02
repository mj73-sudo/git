<template>
  <v-locale-provider locale="fa">
    <v-app>

      <v-main class="bg-white">
        <router-view />
        <v-snackbar v-model="snackbar" right style="direction:ltr" top>
          <div v-html="formatNotificationMessage(snackbarMessage)" />
        </v-snackbar>
      </v-main>

    </v-app>

  </v-locale-provider>
</template>
<script lang="ts" setup>
  import { NotificationStore } from './stores/NotificationStore.ts';
  import { onBeforeUnmount, onMounted } from 'vue';

  const notificationStore = NotificationStore();
  const token = localStorage.getItem('accessToken') || '';

  onMounted(() => {
    notificationStore.getNotifications();
    notificationStore.connectWebSocket();
  });
  const { snackbar, snackbarMessage } = storeToRefs(notificationStore);
  onBeforeUnmount(() => {
    notificationStore.disconnectWebSocket();
  });
  import dayjs from 'dayjs'
  import 'dayjs/locale/fa'

  function formatNotificationMessage (msg: string|undefined) {
    return msg
      ?.replace(/\n/g, '<br>') // تبدیل خط جدید به <br>
      ?.replace(/Time: (.+)/, (_, time) => {
        const formattedTime = dayjs(time).locale('fa').format('YYYY/MM/DD HH:mm:ss')
        return `Time: ${formattedTime}`
      })
  }
</script>
