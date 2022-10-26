import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Order } from "../order/order.model";
import { User } from "../auth/auth.model";
import { join } from "path";

export enum emailSubjects {
    ORDER_CREATED = 'Order Created',
    USER_REGISTERED = "User Registered"
}

@Injectable()
export class MailService {
    constructor(private _mailService: MailerService) { }

    async send(subject: string, data: { user: User, order: Order }) {
       return await this._mailService.sendMail({
            to: data.user.email,
            subject,
            template: './orderDetails',
            context: {
                user: data.user, 
                order: data.order
            }
        })
    }
}