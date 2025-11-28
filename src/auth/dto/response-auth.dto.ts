import { Expose, Transform } from "class-transformer"
import { ObjectId } from "src/_cores/decorators/object-id.decorator"

export class ResponseAuthDto {
    @Expose()
    @ObjectId()
    _id: string
    @Expose()
    name: string
     @Expose()
    email: string
    @Expose()
    role: string
    @Expose()
    bio?: string
    @Expose()
    birthdate?: string
    @Expose()
    phoneNumber?: string
    @Expose()
    isActive: boolean
}