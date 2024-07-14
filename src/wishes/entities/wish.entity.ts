import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntityIdTimestamp } from "src/utils/entities/base.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Wish extends BaseEntityIdTimestamp {

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User
}
