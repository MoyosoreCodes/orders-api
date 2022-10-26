import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./product.model";

@Injectable()
export class ProductService {
    constructor (@InjectModel('products') private _productModel: Model<ProductDocument>) {}

    async create(product: Product | Product[]) {
        return this._productModel.create(product)
    }

    async find(): Promise<Product[]> {
        return this._productModel.find();
    }
}