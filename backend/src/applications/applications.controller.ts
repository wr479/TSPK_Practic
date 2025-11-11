import { Body, Controller, Get, Post, Query, UseGuards, ParseEnumPipe } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateCompanyApplicationDto } from './dto/create-company-application.dto';
import { CreateIndividualApplicationDto } from './dto/create-individual-application.dto';
import { ApplicationType } from './entities/application.entity';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('individual')
  createIndividual(@Body() dto: CreateIndividualApplicationDto) {
    return this.applicationsService.createIndividual(dto);
  }

  @Post('company')
  createCompany(@Body() dto: CreateCompanyApplicationDto) {
    return this.applicationsService.createCompany(dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Get()
  findAll(
    @Query('type', new ParseEnumPipe(ApplicationType, { optional: true }))
    type?: ApplicationType,
  ) {
    return this.applicationsService.findAll(type);
  }
}
