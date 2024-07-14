import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntityIdTimestamp } from "src/utils/entities/base.entity";
import { Length, IsUrl, IsEmail, IsString } from "class-validator";
import { Exclude } from "class-transformer";
import { Wish } from "src/wishes/entities/wish.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";


@Entity()
export class User extends BaseEntityIdTimestamp {
  @Column({ unique: true })
  @IsString()
  @Length(2, 30)
  username: string

  @Column({ default: 'Пока ничего не рассказал о себе'})
  @IsString()
  @Length(2, 200)
  about: string

  @Column({ default: 'https://i.pravatar.cc/300'})
  @IsUrl()
  avatar: string

  @Column()
  @IsEmail()
  email: string
  
  @Column()
  @Exclude()
  password: string

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[]

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[]
}
