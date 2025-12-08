import { IsOptional, IsString } from "class-validator";
import { MediaType } from "src/_cores/global/class";

export class UpdateConversationDto {
    @IsOptional()
    @IsString()
    groupName?: string;
    @IsOptional()
    groupAvatar?: MediaType;
}
