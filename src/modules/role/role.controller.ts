import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('role')
@Controller('api/v1/role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  getRole(@Param('id') id: number) {
    return this.roleService.getRole(id);
  }

  @Post()
  createRole(@Body() newRole: CreateRoleDto) {
    return this.roleService.createRole(newRole);
  }

  @Patch(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() newRole: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, newRole);
  }

  @Delete(':id')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.deleteRole(id);
  }
}
