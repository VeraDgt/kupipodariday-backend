import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserReq } from 'src/utils/types/types';
import { Wish } from 'src/wishes/entities/wish.entity';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { EntityNotFoundFilter } from 'src/filters/exceptions.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findOwn(@AuthUser() user: User): Promise<User> {
    return this.usersService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async updateOne(
    @AuthUser() user: User,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    const { id } = user;
    return this.usersService.updateOne(id, UpdateUserDto);
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  async findMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.usersService.findOwnWishes(Number(user.id));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @Req() req: IUserReq) {
    return this.usersService.removeOne({ id }, req.user.id);
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async getUserByName(@Param('username') username: string) {
    return this.usersService.findByName(username);
  }

  // @Get(':username/wishes')

  @Post('find')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  findManyUsers(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }
}
