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
    @Transform(({ obj }) => obj.avatar?.secure_url ? obj.avatar.secure_url : null)
    seenByAvatar: string;
}



export class ResponseMessagesDto {
    @Expose()
    @ObjectId()
    _id: string;
    @Expose()
    @Transform(({ obj }) => obj.conversation._id.toString())
    conversation: string;
    @Expose()
    @Transform(({ obj }) => obj.sender._id.toString())
    senderId: string;
    @Transform(({ obj }) => obj.sender.name)
    senderName: string;
    @Expose()
    @Transform(({ obj }) => obj.sender.avatar?.secure_url ? obj.sender.avatar.secure_url : null)
    senderAvatar: string;
    @Expose()
    text: string;
    @Expose()
    @Transform(({ obj }) => obj.mediaFiles.map((mediaFile: MediaType) => mediaFile?.secure_url ? mediaFile.secure_url : null))
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