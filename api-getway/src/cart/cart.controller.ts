/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { JwtGuard } from 'src/auth/gurads/jwt/jwt.guard';
import { User } from 'src/auth/decorators/user.decorator';
import type { UserPayload } from 'utils/types';

@Controller('cart')
@UseGuards(JwtGuard)

export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(
    @Body() createCartDto: CreateCartDto,
    @User() user:UserPayload
  ) {
    return this.cartService.create(createCartDto,user.id);
  }




  @Delete(':id')
  @UseGuards(JwtGuard)

  remove(
    @Param('id') id: string,
    @User() user:UserPayload
  ) {
    return this.cartService.remove(id,user.id);
  }
}
