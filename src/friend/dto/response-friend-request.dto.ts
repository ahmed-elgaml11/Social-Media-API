import { Expose, Transform } from "class-transformer"
import { ObjectId } from "src/_cores/decorators/object-id.decorator"

export class ResponseFriendRequestDto {
    @Expose()
    @ObjectId()
    _id: string
    @Expose()
    @Transform(({ obj }) => obj.sender?.name ? obj.sender?.name : null)
    senderName: string
    @Expose()
    @Transform(({ obj }) => obj.sender?._id ? obj.sender?._id.toString() : null)
    senderId: string
    @Expose()
    @Transform(({ obj }) => obj.sender?.avatar?.secure_url ? obj.sender?.avatar?.secure_url : null)
    senderAvatarUrl: string

    @Expose()
    createdAt: Date
    @Expose()
    updatedAt: Date
}
