/* eslint-disable prettier/prettier */
import { Controller, Get,  Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtGuard } from 'src/auth/gurads/jwt/jwt.guard';
import { User } from 'src/auth/decorators/user.decorator';
import type { UserPayload } from 'utils/types';

@Controller('cart-items')
@UseGuards(JwtGuard)

export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}



  @Get(":cartId")
  findAll(
    @User() user:UserPayload,
    @Param('cartId',new ParseUUIDPipe()) cartId:string

  ) {
    return this.cartItemService.findAll(
      user.id,
      cartId

    );
  }



  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateCartItemDto: UpdateCartItemDto,
    @User() user:UserPayload,
  ) {
    return this.cartItemService.update(id, updateCartItemDto,user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user:UserPayload,
  ) {
    return this.cartItemService.remove(id,user.id);
  }
}
