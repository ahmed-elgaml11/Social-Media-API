import { Expose, Transform } from "class-transformer";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";

export class ResponseNotificationDto {
    @Expose()
    @ObjectId()
    _id: string;
    @Expose()
    @ObjectId()
    @Transform(({ obj }) => obj.sender ? obj.sender._id : null)
    senderId: string;
    @Expose()
    @Transform(({ obj }) => obj.sender ? obj.sender.name : null)
    senderName: string;
    @Expose()
    @Transform(({ obj }) => obj.sender?.avatar?.public_id ? obj.sender.avatar.secure_url : null)
    senderAvatarUrl: string;
    @Expose()
    type: string;
    @Expose()
    content: string;
    @Expose()
    isRead: boolean;
    @Expose()
    linkToId: string;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;   
}