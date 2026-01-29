import { IsNotEmpty } from "class-validator"

export class UploadMediaDto {
    @IsNotEmpty()
    public_id: string
    @IsNotEmpty()
    url: string
    @IsNotEmpty()
    secure_url: string
}