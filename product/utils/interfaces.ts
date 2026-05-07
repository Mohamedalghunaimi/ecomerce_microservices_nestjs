/* eslint-disable prettier/prettier */


export interface ProductData {

    title: string;

    description?: string;



    slug: string;
    

    price: number;



    categoryId:string;



    brand?: string;



}

export interface CategoryData {

    name: string;
    slug:string;
    description?:string;

}