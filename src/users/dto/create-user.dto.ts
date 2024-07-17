import { User } from "../entities/user.entity";
import { OmitType } from "@nestjs/swagger";


export class CreateUserDto extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
  'username',
  'about',
  'avatar',
  'email',
  'wishes',
  'offers',
  'wishlists'
] as const) {}
