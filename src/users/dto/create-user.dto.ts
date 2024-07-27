import { IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class CreateUserDto extends PickType(User, [
  'username',
  'about',
  'avatar',
  'email',
] as const) {
  @IsString()
  password: string;
}
