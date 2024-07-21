import { Body, Controller, Post, UseGuards, Req, UseFilters, HttpCode, Get, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from './guards/local.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@AuthUser() user, @Body() signinUserDto: SigninUserDto): Promise<any> {
    return this.authService.signin(user);
  }

  @Post('signup')
  async signUp(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.userService.create(CreateUserDto);
    return await this.userService.create(user);
  }
}

