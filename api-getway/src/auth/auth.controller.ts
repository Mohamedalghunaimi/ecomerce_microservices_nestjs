/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') 
  public register(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.authService.signUp(createUserDto);
  } 

  @Post('login')
  public login(
    @Body() loginDto: LoginDto
  ) {
    return this.authService.login(loginDto);
  }
  
}
