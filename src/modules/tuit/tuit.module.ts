import { Module } from '@nestjs/common';
import { TuitController } from './tuit.controller';
import { TuitService } from './tuit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuit } from './entities/tuit.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tuit, User])],
  controllers: [TuitController],
  providers: [TuitService],
})
export class TuitModule {}
