import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { HashModule } from 'src/hash/hash.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    UsersModule, 
    PassportModule,
    HashModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        secret: ConfigService.get<string>('jwt_secret'),
        signOptions: { expiresIn: '3h' },
      }),
      inject: [ConfigService],
    })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
