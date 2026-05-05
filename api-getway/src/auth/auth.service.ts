/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

;
@Injectable()
export class AuthService {

    constructor(@Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,) {

    }

    public signUp(
        createUserDto: CreateUserDto
    ) {
        return this.authServiceClient.send({ cmd: 'signUp' }, createUserDto);
    }

    public login(
        loginDto: LoginDto
    ) {
        return this.authServiceClient.send({ cmd: 'login' }, loginDto);
    }
}
