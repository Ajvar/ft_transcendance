import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './42auth/42.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User';
import { SessionSerializer } from './utils/Serializer';
import { UsersModule } from 'src/users/users.module';
import { TwoFactorAuthenticationService } from './2fa/2fa.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { TwoFactorStrategy } from './2fa/2fa.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.FT_SECRET,
      signOptions: {
        expiresIn: process.env.COOKIE_EXPIRATION_TIME,
      }
    })
  ],
  providers: [
    FortyTwoStrategy,
    TwoFactorStrategy,
    SessionSerializer,
    TwoFactorAuthenticationService,
    UsersService,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
  ]
})
export class AuthModule {}