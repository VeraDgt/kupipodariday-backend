import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneAndValidate(username);
    if (!user) return null;
    const correctPassword = await this.hashService.compare(pass, user.password);
    if (!correctPassword) return null;
    delete user.password;
    return user;
  }

  async signin(user: User) {
    const { username, id: sub } = user;
    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }
}
