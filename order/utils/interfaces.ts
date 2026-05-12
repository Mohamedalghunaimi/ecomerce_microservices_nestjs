/* eslint-disable prettier/prettier */

export interface CartItem {
    id:string 

    cartId:string

    productId :string

    productName :string
    image?:string
    price :number

    quantity:number

    createdAt :Date
    updatedAt  :Date
    
}

export interface orderData {


  customerName:string


  customerEmail:string



   city:string



   address:string


   phone:string


   cartId:string
}