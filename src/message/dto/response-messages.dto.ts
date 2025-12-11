import { Expose, Transform } from "class-transformer";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";
import { Type } from "class-transformer";
import { MediaType } from "src/_cores/global/class";
export class SeenByDto {
    @Expose()
    @Transform(({ obj }) => obj._id.toString())
    seenById: string;
    @Expose()
    @Transform(({ obj }) => obj.name)
    seenByName: string;
    @Expose()
    @Transform(({ obj }) => obj.avatar?.public_id ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.avatar.resource_type}/upload/${obj.avatar.version}/${obj.avatar.public_id}.${obj.avatar.format}` : null)
    seenByAvatar: string;
}



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
    @Transform(({ obj }) => obj.mediaFiles.map((mediaFile: MediaType) => mediaFile.public_id ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.sender.avatar.resource_type}/upload/${obj.sender.avatar.version}/${obj.sender.avatar.public_id}.${obj.sender.avatar.format}` : null))
    mediaFiles: MediaType[];
    @Expose()
    isDeleted: boolean;
    @Expose()
    @Type(() => SeenByDto)
    seenBy: SeenByDto[];
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

}