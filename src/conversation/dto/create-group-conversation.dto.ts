import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MediaType } from "src/_cores/global/class";

export class CreateGroupConversationDto {
    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    participantIds: string[]

    @IsNotEmpty()
    @IsString()
    groupName: string

    @IsOptional()
    groupAvatar?: MediaType
}
