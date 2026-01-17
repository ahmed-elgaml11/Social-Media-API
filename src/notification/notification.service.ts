import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import type { INotificationType } from 'src/global';
import { Notification } from './schemas/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationGateway } from './notification.gateway';
import { plainToInstance } from 'class-transformer';
import { ResponseNotificationDto } from './dto/response-notification.dto';

@Injectable()
export class NotificationService {

  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<Notification>, private readonly notificationGateway: NotificationGateway) { }

  async create(senderId: string, receiverId: string, type: INotificationType, content: string, linkToId: string) {
    const notification = await this.notificationModel.create({ sender: senderId, receiver: receiverId, type, content, linkToId });

    const populatedNotification = await this.notificationModel.findById(notification._id).populate('sender', 'name avatar').lean();
    const responseNotification = plainToInstance(ResponseNotificationDto, populatedNotification, {
      excludeExtraneousValues: true
    })
    // real time notification
    this.notificationGateway.handleNotification(receiverId, responseNotification);

  }

  async findAll(id: string, limit: number, cursor?: string) {
    const query: Record<string, any> = { receiver: id }
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }
    }
    const notifications = await this.notificationModel
      .find(query)
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit + 1);
    const hasNextPage = notifications.length > limit
    const items = hasNextPage ? notifications.slice(0, limit) : notifications
    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].createdAt : null
    };
  }

  markAsRead(id: string) {
    return this.notificationModel.updateOne({ _id: id }, { isRead: true });
  }

  markAllAsRead(id: string) {
    return this.notificationModel.updateMany({ receiver: id, isRead: false }, { isRead: true });
  }

}
