import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import type { INotificationType } from 'src/global';
import { Notification } from './schemas/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
 
@Injectable()
export class NotificationService {

  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<Notification>) {}

  async create(senderId: string, receiverId: string, type: INotificationType, content: string, linkToId: string) {
    const notification = await this.notificationModel.create({ senderId, receiverId, type, content, linkToId });

    // real time notification
   }

  findAll() {
    return this.notificationModel.find().exec();
  }

  findOne(id: string) {
    return this.notificationModel.findById(id).exec();
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationModel.updateOne({ _id: id }, updateNotificationDto);
  }

  remove(id: string) {
    return this.notificationModel.deleteOne({ _id: id });
  }
}
