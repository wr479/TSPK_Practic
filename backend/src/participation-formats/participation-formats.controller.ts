import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Patch,
  Post,
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
import { ParticipationFormatsService } from './participation-formats.service';
import { CreateParticipationFormatDto } from './dto/create-participation-format.dto';
import { UpdateParticipationFormatDto } from './dto/update-participation-format.dto';
import { ParticipationFormat } from './entities/participation-format.entity';

@ApiTags('Participation Formats')
@Controller('participation-formats')
export class ParticipationFormatsController {
  constructor(
    private readonly participationFormatsService: ParticipationFormatsService,
  ) {}

  @ApiQuery({
    name: 'all',
    required: false,
    description: 'Вернуть также неактивные форматы',
    type: Boolean,
  })
  @ApiOkResponse({ type: [ParticipationFormat] })
  @Get()
  findAll(@Query('all') all?: string) {
    return this.participationFormatsService.findAll(all === 'true');
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiCreatedResponse({ type: ParticipationFormat })
  @Post()
  create(@Body() createDto: CreateParticipationFormatDto) {
    return this.participationFormatsService.create(createDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiOkResponse({ type: ParticipationFormat })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateParticipationFormatDto,
  ) {
    return this.participationFormatsService.update(id, updateDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiOkResponse({ description: 'Формат участия удалён' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participationFormatsService.remove(id);
  }
}
