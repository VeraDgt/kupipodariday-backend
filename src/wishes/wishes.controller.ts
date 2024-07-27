import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IWishPaginator, WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { IUserReq } from 'src/utils/types/types';

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
  findOne(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto, @Req() req: IUserReq) {
    return this.wishesService.update({ id }, updateWishDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @Req() req: IUserReq) {
    return this.wishesService.remove({ id }, req.user);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copyWish(@Param('id') id: number, @Req() req: IUserReq) {
    return this.wishesService.copy({ id }, req.user);
  }
}
