import { Expose, Transform } from "class-transformer";
import * as global from "src/global";
import { MediaType, PostDocument } from "../schemas/post.schema";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";

export class ResponsePostDto {
    @Expose()
    @ObjectId()
    _id: string;
    @Expose()
    backgroundColor: string;
    @Expose()
    content: string;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date
    @Expose()
    privacy: global.IPrivacy
    @Expose()
    mediaUrls: MediaType[]
    // custom properties 
    @Expose()
    @Transform(({obj}: {obj: PostDocument}) => obj.author._id)
    authorId: string
    @Expose()
    @Transform(({obj}) => obj.author.email)
    authorEmail: string
    @Expose()
    @Transform(({obj}) => obj.author.name)
    authorName: string
}