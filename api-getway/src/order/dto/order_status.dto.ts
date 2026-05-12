import { IsEnum } from 'class-validator';

export enum OrderStatus {
  CONFIRMED,
  SHIPPED,
  DELIVERED,
  CANCELLED,
}

export class StatusDto {
  @IsEnum(OrderStatus)
  orderStatus!: OrderStatus;
}
