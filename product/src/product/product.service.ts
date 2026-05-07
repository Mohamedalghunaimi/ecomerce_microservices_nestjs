/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Product } from '@prisma/client';
import { threadCpuUsage } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductData } from 'utils/interfaces';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma:PrismaService
    ) {}

    public async create(data:ProductData) : Promise<Product> {
        const { title, description, slug, price, categoryId, brand } = data;
        const existingCategory = await this.prisma.category.findFirst({
            where: { id: categoryId ,isActive: true },
        });
        if (!existingCategory) {
            throw new RpcException({
                status: 404,
                message: 'Category not found',
            })
        }
        const existingProduct = await this.prisma.product.findUnique({
            where: { slug },
        });
        if (existingProduct) {
            throw new RpcException({
                status: 400,
                message: 'Product with this slug already exists',
            })
        }
        const product = await this.prisma.product.create({
            data: {
                title,
                description,
                slug,
                price,
                categoryId,
                brand,
            },
        });
        return product;
    }


    public async findAll() : Promise<Product[]> {
        const products: Product[] = await this.prisma.product.findMany({
            where: { isActive: true , category:{ isActive: true } },
        });
        return products;
    }

    public async findOne(id:string) : Promise<Product> {
        const product  = await this.prisma.product.findFirst({
            where: { id ,isActive: true , category:{ isActive: true } },
        });
        if (!product) {
            throw new RpcException({
                status: 404,
                message: 'Product not found',
            });
        }
        return product;
    
    }

    public async update(id:string, data: Partial<ProductData>) : Promise<Product> {
        const { slug, categoryId } = data;
        if (categoryId) {
            const existingCategory = await this.prisma.category.findFirst({    
                where: { id: categoryId ,isActive: true },
            });
            if (!existingCategory) {    

                throw new RpcException({
                    status: 404,
                    message: 'Category not found',
                });
            }
        }
        if (slug) {
            const existingProduct = await this.prisma.product.findUnique({  
                where: { slug },
            }); 
            if (existingProduct) { 
                throw new RpcException({
                    status: 400,
                    message: 'Product with this slug already exists',
                });
            }       
        }
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new RpcException({
                status: 404,
                message: 'Product not found',
            });
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data,
        });
        return updatedProduct;
    }

    public async delete(id:string) : Promise<{message:string}> {
        const existingProduct = await this.prisma.product.findFirst({

            where: { id ,isActive: true  }
        });
        if (!existingProduct) {
            throw new RpcException({
                status: 404,
                message: 'Product not found',
            });
        }
        await this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
        return { message: 'Product deleted successfully' };
    }
    public async findByCategory(categoryId:string) : Promise<Product[]> {
        const existingCategory = await this.prisma.category.findFirst({
            where: { id: categoryId ,isActive: true },
        });
        if (!existingCategory) {
            throw new RpcException({
                status: 404,
                message: 'Category not found',
            });
        }   
        const products : Product[] = await this.prisma.product.findMany({
            where: { categoryId, isActive: true },
        });
        return products;
    }

    async reActive(id:string) {
        const existingProduct = await this.prisma.product.findUnique({
            where:{id}
        })
        if(!existingProduct) {
            throw new RpcException({
                status:404,
                message:"product not found"
                
            })
        }
        if(existingProduct.isActive) {
            throw new RpcException({
                status:400,
                message:"product is already active"
            })
        }

        const updatedProduct = await this.prisma.product.update({
            where:{id,isActive:false},
            data:{isActive:true}
        })

        return updatedProduct

    }




}
