import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config'
import { AppController } from './app.controller';
import { ApiModule } from './api';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.production', `.env.development`]
    }),
    ApiModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URI')
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
