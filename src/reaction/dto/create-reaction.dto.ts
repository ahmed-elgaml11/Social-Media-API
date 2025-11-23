import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { REACTION_TYPES } from "src/_cores/global/constants";
import type { IReactionType } from "src/global";

export class CreateReactionDto {
        @IsNotEmpty()
        @IsString()
        postId: string;
        @IsIn(REACTION_TYPES)
        reactionType: IReactionType;
    
}
