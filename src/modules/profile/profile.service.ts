import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createProfile(
    userId: number,
    profile: CreateProfileDto,
  ): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newProfile = this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(newProfile);

    userFound.profile = savedProfile;
    return await this.userRepository.save(userFound);
  }

  async updateProfile(
    userId: number,
    profile: UpdateProfileDto,
  ): Promise<UpdateResult> {
    const userFound = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.profileRepository.update({ id: profile.id }, profile);
  }
}
