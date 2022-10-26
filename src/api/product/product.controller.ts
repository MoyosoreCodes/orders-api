import { Body, Get, Post, Controller, Inject, forwardRef } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./product.model";

@Controller({path: '/products'})
export class ProductController {
    constructor(
        @Inject(forwardRef( () => ProductService))
        private readonly _productService: ProductService
    ) {}

    @Post()
    async createProduct(@Body() productDto: Product) {
        return this._productService.create(productDto);
    }

    @Get()
    async getAllProducts() {
        return this._productService.find();
    }
}