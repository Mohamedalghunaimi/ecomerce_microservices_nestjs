/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
import {  Inject, Injectable,   } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginData, RegisterData } from '../utils/interfaces';
import { UserPayload } from '../utils/types';
import { RpcException } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient:ClientProxy,
  ) {}

  public async login(data: LoginData) {
    const { email, password } = data;
      const user = await this.prisma.user.findUnique({
        where: {
          email
        },
        select: {
          id: true,
          password: true,
          role: true
        }
      });
      if (!user) {
        throw new RpcException({ status: 401, message: 'invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new RpcException({ status: 401, message: 'invalid credentials' });
      }
      const userPayload :UserPayload = {
        id: user.id,
        role: user.role
      }
      const accessToken = await this.jwtService.signAsync(userPayload);
      return { accessToken };

    
  }

  public async register(data: RegisterData) {
    const { email, password } = data;
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email
        }
      }); 
      if (existingUser) {
        throw new RpcException({ status: 409, message: 'email already in use' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,  
          password: hashedPassword,
        }
      });
      const userPayload :UserPayload = {
        id: user.id,
        role: user.role
      }
      this.userClient.emit('user.created', { authId: user.id });
      const accessToken = await this.jwtService.signAsync(userPayload);
      return { accessToken }; 


  }

}