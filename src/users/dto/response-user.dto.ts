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
    @Transform(({ obj }) => obj.avatar.public_id ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.avatar.resource_type}/upload/${obj.avatar.version}/${obj.avatar.public_id}.${obj.avatar.format}` : null)
    avatarUrl: string

    @Expose()
    @Transform(({ obj }) => obj.coverPhoto.public_id ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.coverPhoto.resource_type}/upload/${obj.coverPhoto.version}/${obj.coverPhoto.public_id}.${obj.coverPhoto.format}` : null)
    coverPhotoUrl: string


}