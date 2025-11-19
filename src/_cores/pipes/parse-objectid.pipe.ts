
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
    transform(value: any) {
        if (isValidObjectId(value)) {
            return value;
        }
        throw new BadRequestException('the ovject id in not valid')
    }
}
