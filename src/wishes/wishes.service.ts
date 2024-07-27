import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

const WISH_LIMIT = 20;

export interface IWishPaginator {
  data: Wish[];
  page: number;
  size: number;
  totalCount: number;
  totalPage: number;
}

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.usersService.findById(userId);
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner,
    });

    return this.wishesRepository.save(wish);
  }

  async findAll(query: {
    page: number;
    limit: number;
  }) /*: Promise<IWishPaginator>*/ {
    const skip = (query.page - 1) * query.limit;
    const [data, totalCount] = await this.wishesRepository.findAndCount({
      take: query.limit,
      skip,
    });
    const totalPage = Math.ceil(totalCount / query.limit);
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOneOrFail(query);
  }

  async findMany(query: FindManyOptions<Wish>) {
    const wishes = await this.wishesRepository.find(query);
    return wishes;
  }


  async findLastWishes(): Promise<Wish[]> {
    return this.findMany({
      relations: ['owner', 'offers'],
      order: { createdAt: 'DESC'},
      take: 40,
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return this.findMany({
      relations: ['owner', 'offers'],
      order: { copied: 'DESC'},
      take: 20,
    });
  }

  async findWishById(id: number) {
    return await this.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    })
  }

  async findWishesByOwnerId(ownerId: number) {
    return await this.wishesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  async update(query: FindOptionsWhere<Wish>, updateWishDto: UpdateWishDto, ownerId: number, ) {
    const wish = await this.findOne({
      where: query,
      relations: ['owner', 'offers'],
    });
    if (wish.offers.length > 0 || wish.raised > 0) {
      throw new BadRequestException('На исполнении, изменить не получится');
    }
    return this.wishesRepository.update(query, updateWishDto);
  }

  async remove(query: FindOptionsWhere<Wish>, user: User) {
    const wish = await this.findOne({
      where: query,
      relations: ['owner']
    });
    if (wish.owner.id !== user.id) {
      throw new BadRequestException('Действие запрещено');
    }
    return this.wishesRepository.delete(query);
  }

  async copy(query: FindOptionsWhere<Wish>, user: User) {
    const wish = await this.findOne({
      where: query,
      relations: ['owner'],
    });

    const { name, link, image, price, description } = wish;
    const userWishes = await this.usersService.findOwnWishes(user.id);
    if (userWishes.find(
      (wish) =>
        wish.name === name &&
        wish.link === link &&
        wish.image === image &&
        wish.price === price &&
        wish.description === description,
    )) {
      throw new BadRequestException('Повторная попытка копирования');
    }
    const baseWish = { ...wish, copied: wish.copied + 1 };
    const newWish = await this.create({
      name,
      link,
      image,
      price,
      description,
    }, user.id,)

    await this.wishesRepository.update(query, baseWish);
    return newWish;
  }
}
