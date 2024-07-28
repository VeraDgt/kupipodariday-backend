import { PickType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';
import { Column } from 'typeorm';
import { IsNumber } from 'class-validator';

export class CreateOfferDto extends PickType(Offer, [
  'amount',
  'hidden',
] as const) {
  @IsNumber()
  @Column()
  itemId: number;
}
