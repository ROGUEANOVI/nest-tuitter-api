import { User } from 'src/modules/user/entities/user.entity';

export class ResponseAuthDto {
  user: User;
  token: string;
}
