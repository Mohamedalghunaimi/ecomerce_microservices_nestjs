/* eslint-disable prettier/prettier */
import { Controller,  } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern} from '@nestjs/microservices';
import type { UpdateUserData, UserData } from 'utils/interfaces';
import type { UserPayload } from '../utils/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('user.created' )
  public async createOne(data: UserData) {
    await this.appService.createOne(data);
  }

  @MessagePattern('user.find-all')
  public async findAll(data:UserPayload) {
    return this.appService.findAll(data);
  }

  @MessagePattern('user.get-profile')
  public async getProfile({user,id}:{user:UserPayload, id:string}) {
    return this.appService.getProfile(user, id);
  }

  @MessagePattern('user.update')
  public update({user,id,updateUserDto}:{user:UserPayload, id:string, updateUserDto: UpdateUserData}) {
    return this.appService.update(user, id, updateUserDto);
  }

  @MessagePattern('user.delete')
  public delete({user,id}:{user:UserPayload, id:string}) {
    return this.appService.delete(user, id);
  }

}
