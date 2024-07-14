import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntityIdTimestamp } from "src/utils/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { IsBoolean, IsNumber } from "class-validator";


@Entity()
export class Offer extends BaseEntityIdTimestamp {
  @ManyToOne(() => User, (user) => user.offers)
  user: User

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean
}
