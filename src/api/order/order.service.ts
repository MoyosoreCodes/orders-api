import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Order, OrderDocument } from "./order.model";

@Injectable()
export class OrderService {
    constructor(
        @InjectModel('orders') private _orderModel: Model<OrderDocument>,
    ) {}

    async create(order: Order){
        const newOrder = new this._orderModel(order);
        return await newOrder.save();
    }
    async find(): Promise<Order[]> {
        return await this._orderModel.find();
    }

    async deleteOrder(orderId: string) {
        await this._orderModel.deleteOne({_id: orderId})
    }

    async getOrderDetails(orderId: string): Promise<OrderDocument> {
        return this._orderModel.findOne({_id: orderId})
            .populate('products', 'name quantity')
            .populate('created_by', 'email username password')
            .select('-createdAt -updatedAt -__v')
    }
}