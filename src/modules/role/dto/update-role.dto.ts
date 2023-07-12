import { IsNotEmpty, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { CreateRoleDto } from './create-role.dto';
import { RoleType } from '../enum/role-type.enum';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty()
  @IsEnum(RoleType)
  name: RoleType;
}
