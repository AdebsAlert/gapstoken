import { Module } from '@nestjs/common';
import { PriceBotController } from './controllers/price-bot.controller';
import { PriceBotService } from './services/price-bot.service';

@Module({ controllers: [PriceBotController], providers: [PriceBotService] })
export class PriceBotModule {}
