import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    const newUser = {
      ...createUserDto,
    }
    return this.usersRepository.save(newUser);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(query: FindOneOptions<User>) {
    const user = await this.usersRepository.findOne(query);
    return user;
  }

  async updateOne(query: FindOptionsWhere<User>, updateUserDto: UpdateUserDto, id: number) {
    const user = await this.findOne({ where: query });
    return this.usersRepository.update(query, updateUserDto);
    return user;
  }

  async removeOne(query: FindOptionsWhere<User>, id: number) {
    const user = await this.findOne({ where: query });
    return this.usersRepository.delete(query);
  }
}
