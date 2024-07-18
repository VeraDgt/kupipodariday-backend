import { Body, Controller, Post, UseGuards, Req, UseFilters, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { LocalGuard } from './guards/local.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  @Post('signin')
  async signIn(@Req() req: { user: Promise<User> }) {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  async signUp(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.userService.create(CreateUserDto);
    return await this.userService.create(user);
  }
}

