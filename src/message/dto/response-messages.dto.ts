import { Expose, Transform } from "class-transformer";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";

export class ResponseMessagesDto {
    @Expose()
    @ObjectId()
    _id: string;
    @Expose()
    @ObjectId()
    conversation: string;
    @Expose()
    @ObjectId()
    @Transform(({ obj }) => obj.sender._id.toString())
    senderId: string;
    @Transform(({ obj }) => obj.sender.name)
    senderName: string;
    @Expose()
    @Transform(({ obj }) => obj.sender.avatar?.public_id ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.sender.avatar.resource_type}/upload/${obj.sender.avatar.version}/${obj.sender.avatar.public_id}.${obj.sender.avatar.format}` : null)
    senderAvatar: string;
    @Expose()
    text: string;
    @Expose()
    mediaFiles: string[];
    @Expose()
    isDeleted: boolean;
    @Expose()
    seenBy: string[];
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

}