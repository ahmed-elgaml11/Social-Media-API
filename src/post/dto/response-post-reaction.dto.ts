import { Expose, Transform } from "class-transformer";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";

export class ResponsePostReactionDto {
    @Expose()
    @ObjectId()
    _id: string;
    @Expose()
    @ObjectId()
    post: string;
    @Expose()
    type: string;
    @Expose()
    @Transform(({ obj }) => obj?.user?._id)
    userId: string;
    @Expose()
    @Transform(({ obj }) => obj?.user?.name)
    userName: string;
    @Expose()
    @Transform(({ obj }) => obj?.user?.avatar ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj?.user?.avatar?.resource_type}/upload/${obj?.user?.avatar?.version}/${obj?.user?.avatar?.public_id}.${obj?.user?.avatar?.format}` : null)
    userAvatarUrl: string;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date
} 