import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { EntityNotFoundFilter } from 'src/filters/exceptions.filter';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  getLastWishes(): Promise<Wish[]> {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  getTopWishes(): Promise<Wish[]> {
    return this.wishesService.findTopWishes();
  }

  // @Get()
  // async findAll(@Query() query: { page: number; limit: number }): Promise<IWishPaginator> {
  //   return this.wishesService.findAll(query);
  // }

  
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  findOne(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  update(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto, @AuthUser() user: User) {
    return this.wishesService.update({ id }, updateWishDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  remove(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.remove({ id }, user);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  copyWish(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.copy({ id }, user);
  }
}
