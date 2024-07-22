import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { HashService } from 'src/hash/hash.service';

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
      password: await this.hashService.hashValue(createUserDto.password)
    }
    return this.usersRepository.save(newUser);
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
      }
    })
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async updateOne(updateUserDto: UpdateUserDto, id: number) {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await this.hashService.hashValue(password);
    }
    this.usersRepository.update(id, updateUserDto);
  }

  async removeOne(query: FindOptionsWhere<User>, id: number) {
    const user = await this.findOne({ where: query });
    return this.usersRepository.delete(query);
  }
}
