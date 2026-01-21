import { Expose, Transform, Type } from "class-transformer";
import { PostDocument } from "../schemas/post.schema";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";
import type { IReactionType, IPrivacy } from "src/global";


class MediaType {
    @Transform(({ obj }) => obj.public_id ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.avatar.resource_type}/upload/${obj.avatar.version}/${obj.avatar.public_id}.${obj.avatar.format}` : null)

    @Transform(({ obj }) => obj.public_id ? `
     https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.resource_type}/upload/${obj.version}/${obj.public_id}.${obj.format}` : null)
    @Expose()
    url: string
    @Expose()
    public_id: string
    @Expose()
    version: number
    @Expose()
    display_name: string
    @Expose()
    format: string
    @Expose()
    resource_type: string
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