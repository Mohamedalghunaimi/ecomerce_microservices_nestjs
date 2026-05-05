/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserPayload } from 'utils/types';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
        
    ) {
    }

    public findAll(user: UserPayload) {

        return this.userServiceClient.send('user.find-all' , { user });
    }

    public getProfile(user: UserPayload, id: string) {
        return this.userServiceClient.send('user.get-profile' , { user, id });
    }
    public update(user: UserPayload, id: string, updateUserDto: UpdateUserDto) {
        return this.userServiceClient.send('user.update' , { user, id, updateUserDto });
    }

    public delete(user: UserPayload, id: string) {
        return this.userServiceClient.send('user.delete' , { user, id });
    }


}
