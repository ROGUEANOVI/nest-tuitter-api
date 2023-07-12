import { IsBoolean, IsObject, IsString } from 'class-validator';

export class ResponseTuitDto {
  @IsBoolean()
  isSuccessful: boolean;

  @IsString()
  message: string;

  @IsObject()
  data: object;
}
