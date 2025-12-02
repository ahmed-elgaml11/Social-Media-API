import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { FriendService } from './friend.service';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import type { IUserPaylod } from 'src/global';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-objectid.pipe';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { ResponseFriendDto } from './dto/response-friend.dto';
import { transformToDtoResponse } from 'src/_cores/interceptors/transform-dto.interceptors';

@Controller('friends')
@UseGuards(AuthGuard)
@transformToDtoResponse(ResponseFriendDto)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @HttpCode(200)
  @Post('request/:receiverId')
  sendFriendRequest(@CurrentUser() user: IUserPaylod, @Param('receiverId', ParseObjectIdPipe) id: string) {
    return this.friendService.create(user, id);
  }

  @HttpCode(200)
  @Post('canel-request/:receiverId')
  cancelFriendRequest(@CurrentUser() user: IUserPaylod, @Param('receiverId', ParseObjectIdPipe) id: string) {
    return this.friendService.remove(user, id);
  }

  @Post('accept-request/:friendRequestId')
  async acceptFriendRequest(@CurrentUser() user: IUserPaylod, @Param('friendRequestId', ParseObjectIdPipe) friendRequestId: string) {

    return this.friendService.acceptFriendRequest(user, friendRequestId)
  }

  @Post('reject-request/:friendRequestId')
  async rejectFriendRequest(@CurrentUser() user: IUserPaylod, @Param('friendRequestId', ParseObjectIdPipe) friendRequestId: string) {

    return this.friendService.rejectFriendRequest(user, friendRequestId)
  }

  @Get('request-pending')
  getCurrentPendingRequest(@CurrentUser() user: IUserPaylod) {
    return this.friendService.getCurrentPendingRequest(user);
  }

  @Get()
  getCurrentFriends(@CurrentUser() user: IUserPaylod) {
    return this.friendService.getCurrentFriends(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+id, updateFriendDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.friendService.remove(+id);
  // }
}
