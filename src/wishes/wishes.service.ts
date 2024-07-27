import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

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

  findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  async findWishesByOwnerId(ownerId: number) {
    return await this.wishesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
