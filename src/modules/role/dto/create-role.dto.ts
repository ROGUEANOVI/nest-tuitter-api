import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleType } from '../enum/role-type.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsEnum(RoleType)
  name: RoleType;
}
