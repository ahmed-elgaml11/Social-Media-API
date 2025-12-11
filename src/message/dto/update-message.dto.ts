import { PartialType } from '@nestjs/mapped-types';
import { MediaType } from 'src/_cores/global/class';

export class UpdateMessageDto {
    text?: string;
    mediaFiles?: MediaType[];
}
