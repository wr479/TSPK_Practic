import { Body, Controller, Delete, Get, Param, Query, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll(@Query('all') all?: string) {
    return this.citiesService.findAll(all === 'true');
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}
