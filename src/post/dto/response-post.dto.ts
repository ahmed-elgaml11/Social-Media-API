import { Expose, Transform } from "class-transformer";
import * as global from "src/global";
import { PostDocument } from "../schemas/post.schema";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";


class MediaType {
    @Transform(({ obj }) => `
     https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.resource_type}/upload/${obj.version}/${obj.public_id}.${obj.format}
`)
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
    privacy: global.IPrivacy
    @Expose()
    mediaFiles: MediaType[]
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