import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntityIdTimestamp } from "src/utils/entities/base.entity";
import { User } from "src/users/entities/user.entity";


export class Wishlist extends BaseEntityIdTimestamp {
  @ManyToOne(() => User, (owner) => owner.wishlists)
  owner: User
}
