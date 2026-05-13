/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import cloudinary from './cloudinary.config';
import * as fs from 'fs/promises';
@Injectable()
export class CloudinaryService {



    public async uploadImage(path:string,productId:string) {
        try {
            const result = await cloudinary.uploader.upload(path,{folder:`productsImges-${productId}`})

            return result
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('something went wrong in the server')
            
        } finally {
            await fs.unlink(path);

        }

    }

    public async deleteImage(publicId:string) {
        try {
            await cloudinary.uploader.destroy(publicId,{
                resource_type:"image"
            })
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('something went wrong')
            
        }
    }






}