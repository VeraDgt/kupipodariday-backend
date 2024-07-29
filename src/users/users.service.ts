import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, FindOneOptions, FindOptionsWhere, QueryFailedError } from 'typeorm';
import { HashService } from 'src/hash/hash.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = {
      ...createUserDto,
      password: await this.hashService.hashValue(createUserDto.password),
    };

    try {
      return this.usersRepository.save(newUser);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BadRequestException('Такой пользователь уже зарегистрирован')
      }
    }
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOne(query: FindOneOptions<User>) {
    const user = await this.usersRepository.findOneOrFail(query);
    return user;
  }

  async findOneAndValidate(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        password: true,
        email: true,
        about: true,
        avatar: true,
      },
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await this.hashService.hashValue(password);
    }
    try {
    return this.usersRepository.save({ ...user, ...updateUserDto });
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BadRequestException('Такой пользователь уже зарегистрирован')
      }
    }
  }

  async removeOne(query: FindOptionsWhere<User>, id: number) {
    const user = await this.findOne({ where: query });
    console.log(user);
    if (id !== user.id) {
      return null;
    }
    return this.usersRepository.delete(query);
  }

  async findByName(username: string): Promise<User> {
    const user = await this.findOne({
      where: {
        username: username,
      },
    });
    if (!user) return null;
    return user;
  }

  async findMany(query: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }

  async findOwnWishes(id: number): Promise<Array<Wish>> {
    const options: FindOneOptions<User> = {
      where: { id },
      relations: ['wishes', 'offers'],
    };
    const { wishes } = await this.usersRepository.findOne(options);
    return wishes;
  }

  async findUsersWishses(username: string): Promise<Wish[]> {
    const user = await this.findByName(username);
    if (user) {
      return user.wishes;
    }
  }
}
