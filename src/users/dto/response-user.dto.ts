import { Expose, Transform } from "class-transformer"

export class ResponseUserDto {
    @Expose()
    @Transform(({ obj }) => obj._id.toString())
    id: string
    @Expose()
    name: string
     @Expose()
    email: string
}