/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CategoryData } from 'utils/interfaces';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma:PrismaService,
    private readonly redisService:RedisService

  ) {}
  public async create(createCategoryDto: CategoryData) :Promise<Category> {
    const {slug} = createCategoryDto;
    const existingCategory = await this.prisma.category.findUnique({
      where:{
        slug
      }
    })
    if(existingCategory) {
      throw new RpcException({
        status:400,
        message :"There is category with the same slug"
      })
    }
    const newCategory = await this.prisma.category.create({
      data:{
        ...createCategoryDto
      }
    })

    return newCategory



  }



  async update(id: string, updateCategoryDto:Partial<CategoryData>) :Promise<Category> {
    const existingCategory = await this.prisma.category.findFirst({
      where:{id,isActive:true}
    })
    if(!existingCategory) {
      throw new RpcException({
        status:404,
        message:"category not found"
      })
    }
    const updatedCategory = await this.prisma.category.update({
      where:{id},
      data:{
        ...updateCategoryDto
      }

    })

    return updatedCategory


  }

  async remove(id: string) {
    const existingCategory = await this.prisma.category.findFirst({
      where:{id,isActive:true}
    })
    if(!existingCategory) {
      throw new RpcException({
        status:404,
        message:"category not found"
      })
    }
    await this.prisma.category.update({
      where:{id,isActive:true},
      data:{isActive:false}
    })
    await this.redisService.delete(`products_category_${id}`)

    return {
      message:"category is deleted successfully"
    }

  }

  async reActive(
    id:string
  ) : Promise<Category> {
    const existingCategory = await this.prisma.category.findUnique({
      where:{id}
    })
    if(!existingCategory) {
      throw new RpcException({
        status:404,
        message:"category not found"
      })
    }
    if(existingCategory.isActive) {
      throw new RpcException({
        status:400,
        message:"category is already active"
      })
    }
    const updatedCategory = await this.prisma.category.update({
      where:{id,isActive:false},
      data:{isActive:true}
    })

    return updatedCategory



  }
}
