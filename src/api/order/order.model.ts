import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/api/product/product.model';
import { User } from '../auth/auth.model';

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }])
    products: Product[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "users" })
    created_by: User
}

export type OrderDocument = Order & Document;
export const orderSchema = SchemaFactory.createForClass(Order);

// export { Order, OrderDocument, orderSchema }