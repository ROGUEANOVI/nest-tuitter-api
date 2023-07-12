import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async getRole(id: number): Promise<Role> {
    const roleFound = await this.roleRepository.findOne({ where: { id } });
    if (!roleFound) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return roleFound;
  }

  async createRole(role: CreateRoleDto): Promise<Role> {
    const roleFound = await this.roleRepository.findOne({
      where: { name: role.name },
    });

    if (roleFound) {
      throw new HttpException('Role already exists', HttpStatus.CONFLICT);
    }
    const newRole = this.roleRepository.create(role);
    return await this.roleRepository.save(newRole);
  }

  async updateRole(id: number, newRole: UpdateRoleDto): Promise<UpdateResult> {
    const roleFound = await this.roleRepository.findOne({ where: { id } });
    if (!roleFound) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    } else if (newRole.name === roleFound.name) {
      throw new HttpException('Role already exists', HttpStatus.CONFLICT);
    }

    return await this.roleRepository.update({ id }, newRole);
  }

  async deleteRole(id: number): Promise<DeleteResult> {
    const roleFound = await this.roleRepository.findOne({ where: { id } });
    if (!roleFound) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return await this.roleRepository.delete({ id });
  }
}
