import { Expose, Transform, Type } from "class-transformer";
import { PostDocument } from "../schemas/post.schema";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";
import type { IReactionType, IPrivacy } from "src/global";


class MediaType {
    @Expose()
    url: string
    @Expose()
    secure_url: string
    @Expose()
    public_id: string
}



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
    privacy: IPrivacy
    @Expose()
    @Type(() => MediaType)
    mediaFiles: MediaType[]
    @Expose()
    @Transform(({ obj }) => obj.reactionCounts)
    reactionsCount: Map<IReactionType, number>
    @Expose()
    myReaction: IReactionType | null


    // custom properties 
    @Expose()
    @Transform(({ obj }: { obj: PostDocument }) => obj.author._id)
    authorId: string
    @Expose()
    @Transform(({ obj }) => obj.author.email)
    authorEmail: string
    @Expose()
    @Transform(({ obj }) => obj.author.name)
    authorName: string
}