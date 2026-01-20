import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ResponseCommentDto } from './dto/response-comment.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class CommentGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleCommentCreate(comment: ResponseCommentDto) {
    this.server.emit('comment_created', comment);
  }

  handleCommentUpdate(id: string, content: string, updatedAt: Date) {
    this.server.emit('comment_updated', { id, content, updatedAt });
  }

  handleCommentRemove(id: string, parentId: string | undefined) {
    this.server.emit('comment_removed', { id, parentId });
  }
}     
