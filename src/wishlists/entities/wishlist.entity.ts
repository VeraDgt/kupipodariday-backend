import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntityIdTimestamp } from 'src/utils/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { IsString, Length, IsUrl, Max } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntityIdTimestamp {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ default: '' })
  @IsString()
  @Max(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (owner) => owner.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
