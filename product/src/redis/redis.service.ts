/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy{
    private client : Redis ;
    constructor(
        config:ConfigService

    ) {
        this.client = new Redis({
            host: config.get<string>("REDIS_HOST") || 'redis',
            port: 6379,
        });
    }

    public async set(key:string,cached:string) {
        await this.client.set(key,cached,"EX",3600);
    }

    public async get<T>(key:string):Promise<T | null> {
        const cached = await this.client.get(key) ;
        return cached? JSON.parse(cached as string) as T :null

        
    }

    public async delete(key:string) {
        await this.client.del(key)

    }
    public async push<T>(key:string,newItem:T) {
        const cached = await this.client.get(key);
        if(!cached) {
            await this.set(key,JSON.stringify([newItem]));
            return 

        }
        const newArray = JSON.parse(cached as string) as T[] ;
        newArray.push(newItem)

        await this.set(key,JSON.stringify(newArray));



    }

    public async deleteItem(key:string,newItem:any)  {
        const cached = await this.client.get(key);
        if(!cached) {
            return 
        }
        let items = JSON.parse(cached as string)  ;
        if (!Array.isArray(items)) return false;

        items = items.filter((ele:any)=> ele.id!==newItem.id) ;

        await this.set(key,JSON.stringify(items));
        return true ;

    }

    public async replace(key:string,newItem:any) {
        const cached = await this.client.get(key);
        if(!cached) {
            return 
        }
        let items = JSON.parse(cached as string)  ;
        if (!Array.isArray(items)) return false;
        items = items.map((ele:any) => {
            if(ele.id === newItem.id) {
                return newItem 
            }
            return ele
        })
        await this.set(key,JSON.stringify(items));

    }

    async onModuleDestroy() {
        await this.client.quit();
        
    }

}
