import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { HashModule } from 'src/hash/hash.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigFactory } from 'src/config/jwt-config.factory';
import { HashService } from 'src/hash/hash.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    HashModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      useClass: JwtConfigFactory,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtConfigFactory,
    HashService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
