import { Controller, Param, Post, ParseIntPipe, Body } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiBearerAuth()
  @ApiTags('profile')
  @Post('/user/:id')
  createProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() profile: CreateProfileDto,
  ) {
    return this.profileService.createProfile(userId, profile);
  }
}
