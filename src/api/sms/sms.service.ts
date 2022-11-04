import { TwilioService } from 'nestjs-twilio';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { Order } from '../order/order.model';

@Injectable()
export class SMSService {
    public constructor(
        private readonly twilioService: TwilioService,
        private readonly configService: ConfigService
    ) { }

    async sendOrderSMS(phoneNumber: string, order: Order) {
        let orderDetails: string = '';
        for (let product of order.products) {
            orderDetails += `${product.name} \t ${product.quantity} \n`
        }
        return this.twilioService.client.messages.create({
            body: `You created a new order \n ${orderDetails}`,
            from: this.configService.get('TWILIO_PHONE_NUMBER'),
            to: phoneNumber,
        });
    }
}