import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthUser } from 'src/utils/decorators/user.decorator';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@AuthUser() user): Promise<any> {
    return this.authService.signin(user);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
