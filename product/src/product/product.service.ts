/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Product } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { ProductData } from 'utils/interfaces';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly cloudinaryService:CloudinaryService,
        private readonly redisService:RedisService
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
        await this.redisService.push<Product>('products',product);

        return product;
    }


    public async findAll() : Promise<Product[]> {


        const cached = await this.redisService.get<Product[]>('products');
        if(cached) {
            return cached
        }


        const products: Product[] = await this.prisma.product.findMany({
            where: { isActive: true, category: { isActive: true } },
        });

        await this.redisService.set('products',JSON.stringify(products))

        return products;
    }

    public async findOne(id:string) : Promise<Product> {
        const cached = await this.redisService.get<Product>(`product-${id}`);
        if(cached) {
            return cached
        }
        const product  = await this.prisma.product.findFirst({
            where: { id ,isActive: true , category:{ isActive: true } },
        });
        if (!product) {
            throw new RpcException({
                status: 404,
                message: 'Product not found',
            });
        }
        await this.redisService.set(`product-${id}`,JSON.stringify(product))
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

        await this.redisService.set(`product-${id}`,JSON.stringify(updatedProduct))
        await this.redisService.replace('products',updatedProduct)


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
        await this.redisService.delete(`product-${id}`)
        await this.redisService.deleteItem('products',existingProduct.id)

        return { message: 'Product deleted successfully' };
    }
    public async findByCategory(categoryId:string) : Promise<Product[]> {
        const existingCategory = await this.prisma.category.findFirst({
            where: { id: categoryId , isActive: true },
        });
        if (!existingCategory) {
            throw new RpcException({
                status: 404,
                message: 'Category not found',
            });
        } 
        const cached = await this.redisService.get<Product[]>(`products_category_${categoryId}`) ;
        if(cached) {
            return cached
        }
        const products : Product[] = await this.prisma.product.findMany({
            where: { 
                categoryId, 
                isActive: true ,
                category :{ isActive : true}
            },
        });
        await this.redisService.set(`products_category_${categoryId}`,JSON.stringify(products))


        return products;
    }

    async reActive(id:string) {
        const existingProduct = await this.prisma.product.findUnique({
            where:{id}
        })
        if(!existingProduct) {
            throw new RpcException({
                status:404,
                message:"Product not found"
                
            })
        }
        if(existingProduct.isActive) {
            throw new RpcException({
                status:400,
                message:"Product is already active"
            })
        }
        const updatedProduct = await this.prisma.product.update({
            where:{id,isActive:false},
            data:{isActive:true}
        })
        await this.redisService.set(`product-${id}`,JSON.stringify(updatedProduct))
        await this.redisService.replace('products',updatedProduct)


        return updatedProduct

    }

    async upload(
        file:string,
        productId:string
    ) {
        const result = await this.cloudinaryService.uploadImage(
            file,
            productId
        )
        
        const existingProduct = await this.prisma.product.findUnique({
            where:{id:productId},
            select:{id:true}
        })
        if(!existingProduct) {
            throw new RpcException({
                status:404,
                message:"Product not found"
            })
        }
        const newProductImage = await this.prisma.productImage.create({
            data:{
                url:result.secure_url,
                productId:existingProduct.id,
                publicId:result.public_id
            }
        })
        return newProductImage
    }

    public  deleteProductImage(
        id:string
    ) {
        return this.prisma.$transaction(async(prisma)=> {
        const existingImage = await prisma.productImage.findUnique({
            where:{id},
            select:{id:true,publicId:true}

        })
        if(!existingImage) {
            throw new RpcException({
                status:404,
                message:"image not found"
            })
        }
        await this.cloudinaryService.deleteImage(existingImage.publicId)
        const deletedImage = await prisma.productImage.delete({
            where:{id},
        })

        return deletedImage
        })


    }




}
