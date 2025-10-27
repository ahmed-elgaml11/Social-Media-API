import { Expose, Transform } from "class-transformer"

export class ResponseAuthto {
    @Expose()
    @Transform(({ obj }) => obj._id.toString())
    _id: string
    @Expose()
    name: string
     @Expose()
    email: string
}