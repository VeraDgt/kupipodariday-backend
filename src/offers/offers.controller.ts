import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { EntityNotFoundFilter } from 'src/filters/exceptions.filter';
import { User } from 'src/users/entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user: User) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id') id: number) {
    return this.offersService.findOne({ where: { id }});
  }
}
