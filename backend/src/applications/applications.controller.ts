import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateCompanyApplicationDto } from './dto/create-company-application.dto';
import { CreateIndividualApplicationDto } from './dto/create-individual-application.dto';
import { Application, ApplicationType } from './entities/application.entity';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiCreatedResponse({
    type: Application,
    description: 'Заявка частного лица сохранена',
  })
  @Post('individual')
  createIndividual(@Body() dto: CreateIndividualApplicationDto) {
    return this.applicationsService.createIndividual(dto);
  }

  @ApiCreatedResponse({
    type: Application,
    description: 'Корпоративная заявка сохранена',
  })
  @Post('company')
  createCompany(@Body() dto: CreateCompanyApplicationDto) {
    return this.applicationsService.createCompany(dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Фильтр по типу заявки',
    enum: ApplicationType,
  })
  @ApiOkResponse({ type: [Application] })
  @Get()
  findAll(
    @Query('type', new ParseEnumPipe(ApplicationType, { optional: true }))
    type?: ApplicationType,
  ) {
    return this.applicationsService.findAll(type);
  }
}
