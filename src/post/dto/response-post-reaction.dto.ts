import { Expose, Transform } from "class-transformer";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";

export class ResponsePostReactionDto {
    @Expose()
    @ObjectId()
    _id: string;
    @Expose()
    @Transform(({ value }) => value.toString())
    post: string;
    @Expose()
    type: string;
    @Expose()
    @Transform(({ obj }) => obj?.user?._id.toString())
    userId: string;
    @Expose()
    @Transform(({ obj }) => obj?.user?.name)
    userName: string;
    @Expose()
    @Transform(({ obj }) => obj?.user?.avatar?.secure_url)
    userAvatarUrl: string;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date
} 