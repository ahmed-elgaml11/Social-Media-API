import { IsNotEmpty, IsString } from "class-validator";

export class RemoveReactionDto {
    @IsNotEmpty()
    @IsString()
    postId: string;
}