import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserReq } from 'src/utils/types/types';

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
  async getUserMe(@Req() req: IUserReq) {
    return req.user;
  }

  @Patch('me')
  async updateUserMe(@Body() updateUserDto: UpdateUserDto, @Req() req: IUserReq) {
    return this.usersService.updateOne({ id: req.user.id }, updateUserDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: IUserReq) {
    return this.usersService.removeOne({ id }, req.user.id);
  }
}
