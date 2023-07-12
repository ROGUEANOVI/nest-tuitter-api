import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['profile', 'role', 'tuits'],
    });
  }

  async getUser(id: number): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'role', 'tuits'],
    });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const { password } = user;
    const passwordToHash = await hash(password, 10);
    user = { ...user, password: passwordToHash };

    const userFound = await this.userRepository.findOne({
      where: [{ username: user.username }, { email: user.email }],
    });

    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const roleFound = await this.roleRepository.findOne({
      where: [{ id: user.role.id }, { name: user.role.name }],
    });

    let savedRole: Role;
    if (!roleFound) {
      const newRole = new Role();
      newRole.name = user.role.name;
      savedRole = await this.roleRepository.save(newRole);
    }

    const newUser = new CreateUserDto();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.role = roleFound || savedRole;
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<UpdateResult> {
    if (user.password) {
      const { password } = user;
      const passwordToHash = await hash(password, 10);
      user = { ...user, password: passwordToHash };
    }

    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else if (
      user.username === userFound.username ||
      user.email === userFound.email
    ) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    if (user.role) {
      const roleFound = await this.roleRepository.findOne({
        where: [{ id: user.role.id }, { name: user.role.name }],
      });

      if (!roleFound) {
        const newRole = new Role();
        newRole.name = user.role.name;
        const savedRole = await this.roleRepository.save(newRole);

        user.role = savedRole;
      }

      user.role = roleFound;
    }

    return await this.userRepository.update({ id }, user);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.delete({ id });
  }
}
