import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from "./product.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "products", schema: productSchema },
        ])
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule { }