import { Expose, Transform } from "class-transformer";

export class ResponseConversationDto {
    @Expose()   
    _id: string;
    @Expose()   
    isGroup: boolean;
    @Expose()   
    @Transform(({ obj }) => obj.groupOwner._id)
    groupOwnerId?: string;
    @Expose()   
    @Transform(({ obj }) => obj.groupOwner.name)
    groupOwnerName?: string;
    @Expose()   
    @Transform(({ obj }) => obj.groupOwner.email)
    groupOwnerEmail?: string;
    @Expose()  
    @Transform(({ obj }) => obj.groupAvatar ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.groupAvatar.resource_type}/upload/${obj.groupAvatar.version}/${obj.groupAvatar.public_id}.${obj.groupAvatar.format}` : null) 
    groupAvatarUrl?: string;
    @Expose()   
    groupName?: string;
    @Expose()   
    createdAt: Date;
    @Expose()   
    updatedAt: Date;
    
}
