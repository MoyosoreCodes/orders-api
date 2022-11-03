import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Order API is now running, view it <a href='https://documenter.getpostman.com/view/12993294/2s8YY9xSqR'> here </a>`;
  }
}
