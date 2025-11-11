import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Tariff } from './entities/tariff.entity';

@Injectable()
export class TariffsService {
  constructor(
    @InjectRepository(Tariff)
    private readonly tariffsRepository: Repository<Tariff>,
  ) {}

  create(createDto: CreateTariffDto) {
    const tariff = this.tariffsRepository.create(createDto);
    return this.tariffsRepository.save(tariff);
  }

  findAll() {
    return this.tariffsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findActive() {
    return this.tariffsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const tariff = await this.tariffsRepository.findOne({ where: { id } });
    if (!tariff) {
      throw new NotFoundException(`Тариф с id ${id} не найден`);
    }
    return tariff;
  }

  async update(id: string, updateDto: UpdateTariffDto) {
    const tariff = await this.findOne(id);
    return this.tariffsRepository.save({ ...tariff, ...updateDto });
  }

  async remove(id: string) {
    const tariff = await this.findOne(id);
    await this.tariffsRepository.remove(tariff);
  }
}
