import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntityIdTimestamp } from "src/utils/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { IsString, Length, IsUrl, IsNumber, IsInt } from "class-validator";
import { Offer } from "src/offers/entities/offer.entity";

@Entity()
export class Wish extends BaseEntityIdTimestamp {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string

  @Column()
  @IsUrl()
  link: string

  @Column()
  @IsUrl()
  image: string

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[]

  @Column()
  @IsInt()
  copied: number
}
