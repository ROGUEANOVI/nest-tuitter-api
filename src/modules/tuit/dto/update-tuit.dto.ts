import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateTuitDto } from '.';

export class UpdateTuitDto extends PartialType(CreateTuitDto) {
  @IsOptional()
  @IsString()
  readonly content: string;
}
