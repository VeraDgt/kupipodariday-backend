import { forwardRef, Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { OffersModule } from 'src/offers/offers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    forwardRef(() => UsersModule),
    AuthModule,
    forwardRef(() => OffersModule),
  ],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
