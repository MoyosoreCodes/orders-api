import { Document } from "mongoose";
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'

@Schema({timestamps: true, collection: 'products'})
export class Product {

    @Prop({ required: true })
    name: string

    @Prop({ minimum: 1, default: 1 })
    quantity: string
    
}

export type ProductDocument = Product & Document;
export const productSchema = SchemaFactory.createForClass(Product);

// export { Product, ProductDocument, productSchema }