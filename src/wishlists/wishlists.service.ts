import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository, In } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    owner: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const wishes = await this.wishesService.findMany({
      where: { id: In(createWishlistDto.itemsId) },
    });

    return this.wishlistRepository.save({
      owner: owner,
      items: wishes,
      ...createWishlistDto,
    });
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async update(
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(wishlistId);
    if (userId !== wishlist.owner.id) {
      throw new BadRequestException('Доступ запрещен');
    }
    if (updateWishlistDto.itemsId) {
      const wishes = await this.wishesService.findMany({
        where: { id: In(updateWishlistDto.itemsId) },
      });
      wishlist.items.push(...wishes);
      await this.wishlistRepository.save(wishlist);
      await this.wishlistRepository.update(wishlistId, updateWishlistDto);
    } else {
      await this.wishlistRepository.update(wishlistId, updateWishlistDto);
    }
    return wishlist;
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (userId !== wishlist.owner.id) {
      throw new BadRequestException('Элемент не найден');
    }
    return await this.wishlistRepository.delete(id);
  }
}
