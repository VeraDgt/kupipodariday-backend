import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashModule } from 'src/hash/hash.module';
import { HashService } from 'src/hash/hash.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { AuthModule } from 'src/auth/auth.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer, Wishlist]),
  forwardRef(() => AuthModule),
  forwardRef(() => WishesModule),
  HashModule,
],  
  controllers: [UsersController],
  providers: [UsersService, HashService, WishesService],
  exports: [UsersService],
})
export class UsersModule {}
