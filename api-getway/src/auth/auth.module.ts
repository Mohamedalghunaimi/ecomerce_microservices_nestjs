/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [
    ClientsModule.register([
      {
          name:"AUTH_SERVICE",
          transport: Transport.TCP,
          options: {
            host: 'auth-service', 
            port: 3000, 
          }
      }
    ]),
  ],
})
export class AuthModule {}
