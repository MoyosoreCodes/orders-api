import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { MongooseModule } from "@nestjs/mongoose";
import { orderSchema } from "./order.model";
import { ProductModule } from "../product/product.module";
import { AuthModule } from "../auth/auth.module";
import { MailModule } from "../mail/mail.module";
import { SMSModule } from "../sms/sms.module";


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'orders' , schema: orderSchema}
        ]),
        ProductModule, 
        AuthModule,
        MailModule,
        SMSModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}