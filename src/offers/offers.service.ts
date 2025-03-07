import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findWishById(itemId);
    if (user.id !== wish.owner.id) {
      throw new ForbiddenException('Доступ запрещен');
    }
    if (
      amount > wish.price ||
      amount > Number(wish.price) - Number(wish.raised) ||
      wish.price === wish.raised
    ) {
      throw new ForbiddenException('Сумма превышает требуемую');
    }
    await this.wishesService.raise(
      wish.id,
      Number(wish.raised) + Number(amount),
    );

    return await this.offersRepository.save({
      user,
      item: wish,
      ...createOfferDto,
    });
  }

  findAll() {
    return this.offersRepository.find({
      relations: ['item', 'user'],
    });
  }

  findOne(query: FindOneOptions<Offer>) {
    return this.offersRepository.findOne(query);
  }
}
