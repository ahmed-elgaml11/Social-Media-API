import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import type { IUserPaylod } from 'src/global';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { transformToDtoResponse } from 'src/_cores/interceptors/transform-dto.interceptors';
import { ResponseNotificationDto } from './dto/response-notification.dto';


@UseGuards(AuthGuard)
@transformToDtoResponse(ResponseNotificationDto)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(@CurrentUser() user: IUserPaylod) {
    return this.notificationService.findAll(user.id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }
}
