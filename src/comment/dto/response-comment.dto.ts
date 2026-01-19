import { Expose, Transform, Type } from "class-transformer";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";

export class ResponseCommentDto {
    @Expose()
    @ObjectId()
    _id: string;
    @Expose()
    content: string;
    // @Expose()
    // @ObjectId()
    // @Transform(({obj}) => obj.post)
    // postId: string
    @Expose()
    @ObjectId()
    post: string

    @Expose()
    @ObjectId()
    @Transform(({ obj }) => obj.parent ? obj.parent : null)
    parent: string

    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;


    @Expose()
    @Transform(({ obj }) => obj.user ? obj.user._id : null)
    userCommentId: string;
    @Expose()
    @Transform(({ obj }) => obj.user ? obj.user.name : null)
    userCommentName: string;
    // ToDo 
    // userCommentAvatar: string | null;


    @Expose()
    @Transform(({ obj }) => obj.replyToUser ? obj.replyToUser._id : null)
    replyToUserId: string;
    @Expose()
    @Transform(({ obj }) => obj.replyToUser ? obj.replyToUser.name : null)
    replyToUserName: string;
    // ToDo 
    // replyToUserAvatar: string | null;


    @Expose()
    @Type(() => ResponseCommentDto)   // for nested properties
    replies: ResponseCommentDto[];
}