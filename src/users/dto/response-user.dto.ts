import { Expose, Transform } from "class-transformer"

export class ResponseUserDto {
    @Expose()
    id: string
    @Expose()
    name: string
     @Expose()
    email: string
    @Expose()
    role: string
}