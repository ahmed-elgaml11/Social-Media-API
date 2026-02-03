import { Expose, Transform } from "class-transformer"
import { ObjectId } from "src/_cores/decorators/object-id.decorator"

export class ResponseFriendDto {
    @Expose()
    @ObjectId()
    _id: string
    @Expose()
    name: string
    @Expose()
    @Transform(({ obj }) => obj?.avatar?.secure_url ? obj.avatar?.secure_url : null)
    avatarUrl: string
}