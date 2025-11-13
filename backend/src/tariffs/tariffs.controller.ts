import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { TariffsService } from './tariffs.service';
import { Tariff } from './entities/tariff.entity';

@ApiTags('Tariffs')
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @ApiQuery({
    name: 'all',
    required: false,
    description: 'Вернуть также неактивные тарифы',
    type: Boolean,
  })
  @ApiOkResponse({ type: [Tariff] })
  @Get()
  find(
    @Query('all')
    all?: string,
  ) {
    if (all === 'true') {
      return this.tariffsService.findAll();
    }

    return this.tariffsService.findActive();
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiCreatedResponse({ type: Tariff })
  @Post()
  create(@Body() dto: CreateTariffDto) {
    return this.tariffsService.create(dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiOkResponse({ type: Tariff })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTariffDto) {
    return this.tariffsService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiOkResponse({ description: 'Тариф удалён' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tariffsService.remove(id);
  }
}
