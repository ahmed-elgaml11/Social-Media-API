import { IsDateString, IsOptional, IsPhoneNumber, Max, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    name?: string;
    @IsOptional()
    @MaxLength(50)
    bio?: string; @IsOptional()
    @IsDateString()
    birthdate?: string
    @IsOptional()
    @IsPhoneNumber()
    phoneNumber?: string
}
