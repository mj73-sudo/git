import { defineStore } from 'pinia';
import { NotificationModel } from '../models/NotificationModel.ts';
import api from '../plugins/axios.ts';
import WebSocketService from '../services/WebSocketService.ts';
import { ref } from 'vue';

export const NotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationModel[]>([]);
  const snackbar = ref(false);
  const snackbarMessage = ref<string | undefined>();
  const wsService = ref(new WebSocketService());
  const connected = ref(false);

  const getNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      notifications.value = res.data.content;
    } catch (err) {
      console.error(err);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    wsService.value.connect('http://localhost:8585/ws', token, (msg: string) => {
      const notification: NotificationModel = JSON.parse(msg);
      notification.read = false
      notifications.value.unshift(notification);
      snackbarMessage.value = notification?.message?.replace(/\n/g, '<br>');
      snackbar.value = true;
    });

    connected.value = wsService.value.connected;
  };

  const disconnectWebSocket = () => {
    wsService.value.disconnect();
    connected.value = false;
  };

  return {
    notifications,
    snackbar,
    snackbarMessage,
    connected,
    getNotifications,
    connectWebSocket,
    disconnectWebSocket,
  };
});
