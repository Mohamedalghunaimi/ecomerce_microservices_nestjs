/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable prettier/prettier */
import {  Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { Order } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class StripeService {

    private stripe : InstanceType<typeof Stripe>; ;


    constructor(
        config:ConfigService
    ) {
        this.stripe = new Stripe(config.get<string>('STRIPE_SECRET_KEY') as string,{
            apiVersion:"2026-04-22.dahlia"
        })
    }

    public async createCheckoutSession(order:Order){
        
        
        const session = await this.stripe.checkout.sessions.create({
            mode:"payment",
            payment_method_types:['card'],
            line_items:[
                {
                    price_data:{
                        currency:"usd",
                        product_data:{
                            name:"order from our website"
                        },
                        unit_amount:order.totalPrice *100
                    },
                    
                }
            ],
            success_url:`${process.env.DOMAIN}/success?orderId=${order.id}`,
            cancel_url:`${process.env.DOMAIN}/cancel?orderId=${order.id}`

        })
        return session
        

    }
    public async retriveSession(sessionId:string)  {
        try {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        return session
        } catch (error) {
            console.error(error)
            throw new RpcException({
                status:404,
                message:"Session is not existed"
            })
        }

    }
}