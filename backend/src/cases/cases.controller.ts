import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CasesService } from './cases.service';

@ApiTags('Cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  findPublished() {
    return this.casesService.findPublished();
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Get('all')
  findAll() {
    return this.casesService.findAll();
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Post()
  create(@Body() dto: CreateCaseDto) {
    return this.casesService.create(dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCaseDto) {
    return this.casesService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.casesService.remove(id);
  }
}
