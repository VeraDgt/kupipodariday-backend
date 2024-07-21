import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseFilters, UseGuards } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
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

  // @Get('me/wishes')
  // async findMyWishes(@AuthUser() user: User): Promise<Wish[]> {
  //   const relations = [ 'wishes', 'wishes.owner', 'wishes.offers' ];
  //   return await this.usersService.findWishes(id, relations);
  // }

  @Patch('me')
  @UseFilters(EntityNotFoundFilter)
  async updateOne(@AuthUser() user: User, @Body() UpdateUserDto: UpdateUserDto) {
    const { id } = user;
    return this.usersService.updateOne(UpdateUserDto, id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: IUserReq) {
    return this.usersService.removeOne({ id }, req.user.id);
  }
}
