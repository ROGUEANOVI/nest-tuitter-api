import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

export class CreateTuitDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsObject()
  readonly user: Partial<User>;
}
