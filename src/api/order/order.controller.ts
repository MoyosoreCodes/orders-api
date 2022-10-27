import { Get, Post, Controller, Inject, forwardRef, Req, UseGuards, HttpStatus } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ProductService } from "../product/product.service";
import { Order } from "./order.model";
import { AuthService } from "../auth/auth.service";
import { emailSubjects, MailService } from "../mail/mail.service";
import { ProductDocument } from "../product/product.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthGuard } from '@nestjs/passport';


@Controller({ path: '/orders' })
export class OrderController {
    constructor(
        @Inject(forwardRef(() => OrderService))
        private readonly _orderService: OrderService,
        private readonly _productService: ProductService,
        private _mailService: MailService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createOrder(@Req() req) {
        try {
            console.log("creating a new order")
            const { products } = req.body;
            const user = req.user;
    
            const newProducts = await this._productService.create(products);
            const productIds = Array.isArray(newProducts) ? [...newProducts.map((product: ProductDocument) => product._id)] : [newProducts._id]
            
            let newOrder: Order = {
                products: productIds,
                created_by: user._id
            }
            const createdOrder = await this._orderService.create(newOrder);
    
            const order = await this._orderService.getOrderDetails(createdOrder._id)
            
            const response = await this._mailService.send(emailSubjects.ORDER_CREATED, { user: order.created_by , order })
            if(!response || response.response.split('')[0] != 250 ) {
                await this._orderService.deleteOrder(order._id)
            }
            return {
                statusCode: HttpStatus.CREATED,
                message: "Order created check your email for details",
                data: order
            };
        } catch (error) {
            console.log(error.message)
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    @Get()
    async getAllOrders() {
        return this._orderService.find();
    }
}