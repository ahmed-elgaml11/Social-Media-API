import { Expose, Transform } from "class-transformer"
import { ObjectId } from "src/_cores/decorators/object-id.decorator"

export class ResponseUserDto {
    @Expose()
    @ObjectId()
    id: string
    @Expose()
    name: string
    @Expose()
    email: string
    @Expose()
    role: string
    @Expose()
    isActive: Date
    @Expose()
    birthdate: Date
    @Expose()
    phoneNumber: string
    @Expose()
    bio: boolean
    @Expose()
    @Transform(({ obj }) => obj.avatar ? obj.avatar.secure_url : null)
    avatarUrl: string

    @Expose()
    isFriend: boolean
    @Expose()
    @Transform(({ obj }) => obj.coverPhoto?.secure_url ? obj.coverPhoto.secure_url : null)
    coverPhotoUrl: string


}