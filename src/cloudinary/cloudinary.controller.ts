// app.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { version } from 'os';

@Controller('image')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const result = await this.cloudinaryService.uploadFile(file);
        return {
            message: 'success',
            data: {
                public_id: result.public_id,
                version: result.version,
                display_name: result.display_name,
                format: result.format,
                resource_type: result.resource_type,
            }
        }
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
        const result = await this.cloudinaryService.uploadMultipleFiles(files);
        return {
            message: 'success',
            data: result.map(file => ({
                public_id: file.public_id,
                version: file.version,
                display_name: file.display_name,
                format: file.format,
                resource_type: file.resource_type,
            }))
        }
    }
}
