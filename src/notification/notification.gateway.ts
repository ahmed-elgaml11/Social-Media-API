import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ResponseNotificationDto } from './dto/response-notification.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class NotificationGateway {
    @WebSocketServer()
    server: Server;
  
  handleNotification(receiverId: string, data: ResponseNotificationDto) {
    console.log('notification_created', data);
    this.server.to(receiverId).emit('notification_created', data);
  }
}
