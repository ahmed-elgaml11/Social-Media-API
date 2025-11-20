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

@Controller('image')
export class Cloudinaryontroller {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.cloudinaryService.uploadFile(file);
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]){
        return this.cloudinaryService.uploadMultipleFiles(files);

    }
}
