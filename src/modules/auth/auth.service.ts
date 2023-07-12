import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private jwtAuthService: JwtService,
  ) {}

  async register(user: RegisterAuthDto): Promise<User> {
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

    const newUser = new User();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.role = roleFound || savedRole;
    return await this.userRepository.save(newUser);
  }

  async login(loginUser: LoginAuthDto): Promise<ResponseAuthDto> {
    const { username, email, password } = loginUser;
    const userFound = await this.userRepository.findOne({
      where: [{ username }, { email }],
      relations: ['profile', 'role', 'addresses'],
    });

    if (!userFound) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const checkPassword = await compare(password, userFound.password);

    if (!checkPassword) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const payload = {
      id: userFound.id,
      username: userFound.username,
      role: userFound.role.name,
    };

    const token = this.jwtAuthService.sign(payload);

    const responseAuthDto = new ResponseAuthDto();
    responseAuthDto.user = userFound;
    responseAuthDto.token = token;

    return responseAuthDto;
  }
}
