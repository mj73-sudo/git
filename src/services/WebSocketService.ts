import { Client } from '@stomp/stompjs';

// WebSocketService ساده بدون SockJS
export default class WebSocketService {
  private client: Client | null = null;
  private subscription: any = null;
  public connected: boolean = false;

  connect (url: string, token: string, onMessage: (msg: string) => void) {
    this.client = new Client({
      brokerURL: url.replace(/^http/, 'ws'), // استفاده از ws:// یا wss://
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: str => console.log('[STOMP]', str),
      reconnectDelay: 5000,

      //sseeeeeeeeeeeeeeeeeeeeeeeeeeeesss پیام عمومی
      onConnect: () => {
        this.subscription = this.client?.subscribe('/topic/notification', (msg: any) => {
          console.log(msg);
          onMessage(msg.body);
          if (msg.ack) msg.ack();
        });

        //دریافت پیام خصوصی
        this.subscription = this.client?.subscribe('/user/queue/signals', (msg: any) => {
          console.log('PRIVATE MESSAGE:', msg.body);
          onMessage(msg.body);
          if (msg.ack) msg.ack();
        });
      },



      onWebSocketClose: () => {
        this.connected = false;
      },
      onStompError: () => {
        this.connected = false;
      },
    });

    this.client.activate();
  }
  //قطع اتصال
  disconnect () {
    this.subscription?.unsubscribe();
    this.client?.deactivate();
    this.client = null;
    this.subscription = null;
    this.connected = false;
  }
}
