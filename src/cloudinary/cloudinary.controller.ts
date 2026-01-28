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

@Controller('cloudinary')
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
                url: result.url,
                secure_url: result.secure_url 
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
                url: file.url,
                secure_url: file.secure_url 
            }))
        }
    }
}
