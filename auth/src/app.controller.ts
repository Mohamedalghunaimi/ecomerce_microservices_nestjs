/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import type { LoginData, RegisterData } from 'utils/interfaces';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'login' })
  public login(data: LoginData) {
    return this.appService.login(data);
    
  }

  @MessagePattern({ cmd: 'signUp' })
  public  register(data: RegisterData) {
    return this.appService.register(data);  
  }


 
}
