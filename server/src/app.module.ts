import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PriceBotModule } from './price-bot/price-bot.module';

@Module({
  imports: [ConfigModule.forRoot(), PriceBotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
