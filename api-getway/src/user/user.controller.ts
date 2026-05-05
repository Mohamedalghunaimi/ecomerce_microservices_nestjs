/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/gurads/jwt/jwt.guard';
import { User } from 'src/auth/decorators/user.decorator';
import type { UserPayload } from 'utils/types';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  @UseGuards(JwtGuard)
  findAll(
    @User() user: UserPayload
  ) {
    return this.userService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getProfile(
    @User() user: UserPayload,
    @Param('id') id: string
  ) {
    return this.userService.getProfile(user, id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @User() user: UserPayload,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(user, id, updateUserDto);
  }


  @Delete(':id')
  @UseGuards(JwtGuard)
  delete(
    @User() user: UserPayload,
    @Param('id') id: string
  ) {
    return this.userService.delete(user, id); 
  }
}
