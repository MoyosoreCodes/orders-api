import { Get, Post, Controller, Inject, forwardRef, Req, UseGuards, HttpStatus } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ProductService } from "../product/product.service";
import { Order } from "./order.model";
import { emailSubjects, MailService } from "../mail/mail.service";
import { ProductDocument } from "../product/product.model";
import { AuthGuard } from '@nestjs/passport';
import { SMSService } from "../sms/sms.service";


@Controller({ path: '/orders' })
export class OrderController {
    constructor(
        @Inject(forwardRef(() => OrderService))
        private readonly _orderService: OrderService,
        private readonly _productService: ProductService,
        private _mailService: MailService,
        private _smsService: SMSService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createOrder(@Req() req) {
        try {
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

            // const result = await this._smsService.sendOrderSMS(order.created_by.phoneNumber, order)
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
        const orders  = await this._orderService.find();
        return {
            statusCode: orders.length > 0 ? 200 : 404,
            message: orders.length > 0 ? "successfully retrieved orders" : "no orders to show",
            data: orders
        }
    }
}