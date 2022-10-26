import { Module } from "@nestjs/common";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";

@Module({
    imports: [
        ProductModule,
        OrderModule,
        AuthModule,
        MailModule
    ]
})

export class ApiModule { }