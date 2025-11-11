import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
  ) {}

  create(createCityDto: CreateCityDto) {
    const city = this.citiesRepository.create(createCityDto);
    return this.citiesRepository.save(city);
  }

  findAll(includeInactive = false) {
    return this.citiesRepository.find({
      where: includeInactive ? {} : { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const city = await this.citiesRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException(`Город с id ${id} не найден`);
    }
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);
    return this.citiesRepository.save({ ...city, ...updateCityDto });
  }

  async remove(id: string) {
    const city = await this.findOne(id);
    await this.citiesRepository.remove(city);
  }
}
