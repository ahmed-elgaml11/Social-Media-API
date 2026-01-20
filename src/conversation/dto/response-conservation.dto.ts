import { Expose, Transform, Type } from "class-transformer";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";
export class ParticipantDto {
    @Expose()
    _id: string;
    @Expose()
    name: string;
    @Expose()
    email: string;
    @Expose()
    @Transform(({ obj }) => obj.avatar ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.avatar.resource_type}/upload/${obj.avatar.version}/${obj.avatar.public_id}.${obj.avatar.format}` : null)
    avatarUrl?: string;
}



export class ResponseConversationDto {
    @Expose()
    _id: string;
    @Expose()
    isGroup: boolean;

    @Expose()
    @Type(() => ParticipantDto)
    participants: ParticipantDto[];
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
    lastMessageAt?: string;
    @Expose()
    isLastMessageSeen?: boolean;

    @Expose()
    @Transform(({ obj }) => obj.lastMessage?.content)
    lastMessageContent?: string;

    @Expose()
    @Transform(({ obj }) => obj.lastMessage?.sender?.name)
    senderLastMessageName?: string;
    @Expose()
    @ObjectId()
    @Transform(({ obj }) => obj.lastMessage?.sender?._id)
    senderLastMessageId?: string;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

}
