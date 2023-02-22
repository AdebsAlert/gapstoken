import { Query, Controller, Get } from '@nestjs/common';
import { PriceBotService } from '../services/price-bot.service';
import { RequestPriceDto } from '../dtos/price-bot.dto';

@Controller('price-bot')
export class PriceBotController {
  constructor(private priceBotService: PriceBotService) {}

  @Get()
  getPrices(@Query() payload: RequestPriceDto) {
    return this.priceBotService.getPrices(payload);
  }
}
