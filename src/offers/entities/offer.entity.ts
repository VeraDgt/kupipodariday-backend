import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntityIdTimestamp } from "src/utils/entities/base.entity";
import { User } from "src/users/entities/user.entity";


@Entity()
export class Offer extends BaseEntityIdTimestamp {
  @ManyToOne(() => User, (user) => user.offers)
  user: User
}
