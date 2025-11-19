import { IsHexColor, IsIn, IsISIN, IsNotEmpty, IsOptional, IsString } from "class-validator"
import type { IPrivacy } from "src/global"

export class CreatePostDto {
    @IsOptional()
    @IsHexColor()
    backgroundColor: string
    @IsNotEmpty()
    @IsString()
    content: string
    @IsOptional()
    @IsIn(['public', 'private', 'friends'])
    privacy: IPrivacy
}
