import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloundinary.provider';
import {  CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
  controllers: [CloudinaryController]
})
export class CloudinaryModule {}
