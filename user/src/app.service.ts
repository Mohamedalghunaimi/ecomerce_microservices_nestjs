/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import type { UpdateUserData, UserData } from 'utils/interfaces';
import { RpcException } from '@nestjs/microservices';
import { UserPayload } from 'utils/types';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  public async createOne(data: UserData) {
    const { authId } = data;
    const existingUser = await this.prisma.userProfile.findUnique({
      where: {
        authId,
      },
    });
    if (existingUser) { 
      return existingUser;

    }
    const newUser = await this.prisma.userProfile.create({
      data: {
        authId,
      },
    });
    return newUser; 

  }

  public async findAll(user:UserPayload) {
    if (user.role !== 'ADMIN') {
      throw new RpcException({ status: 403, message: 'forbidden' });
    }
    return this.prisma.userProfile.findMany();
  }

  public async getProfile(
    user: UserPayload,
    id: string
  ) {
    const userProfile = await this.prisma.userProfile.findFirst({
      where: {
        id,
      },
    });
    if(!userProfile) {
      throw new RpcException({ status: 404, message: 'User not found' });
    }

    if (user.id !== userProfile.authId && user.role !== 'ADMIN') {
      throw new RpcException({ status: 403, message: 'forbidden' });
    }
    return userProfile;
  }

  public async update(
    user: UserPayload,
    id: string,
    updateUserDto: UpdateUserData
  ) {
    const { firstName, lastName, phone } = updateUserDto;
    const userProfile = await this.prisma.userProfile.findFirst({
      where: {
        id,
      },
    });
    if(!userProfile) {
      throw new RpcException({ status: 404, message: 'User not found' });
    }
    if(user.id !== userProfile.authId && user.role !== 'ADMIN') {
      throw new RpcException({ status: 403, message: 'forbidden' });
    }
    const updatedUser  = await this.prisma.userProfile.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        phone
      },
    });
    return updatedUser;
  }

  public async delete(
    user: UserPayload,
    id: string  
  ) {
    if(user.role !== 'ADMIN') {
      throw new RpcException({ status: 403, message: 'forbidden' });
    }
    const userProfile = await this.prisma.userProfile.findFirst({
      where: {
        id,
      },
    }); 
    if(!userProfile) {

      throw new RpcException({ status: 404, message: 'User not found' });
    }

    await this.prisma.userProfile.delete({
      where: {
        id: userProfile.id, 
      },
    });
    return { message: 'User deleted successfully' };
  }

}
