import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleType } from '../enum/role-type.enum';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  id: number;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
    unique: true,
  })
  name: RoleType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
