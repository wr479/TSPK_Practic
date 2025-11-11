import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParticipationFormatDto } from './dto/create-participation-format.dto';
import { UpdateParticipationFormatDto } from './dto/update-participation-format.dto';
import { ParticipationFormat } from './entities/participation-format.entity';

@Injectable()
export class ParticipationFormatsService {
  constructor(
    @InjectRepository(ParticipationFormat)
    private readonly participationFormatsRepository: Repository<ParticipationFormat>,
  ) {}

  create(createDto: CreateParticipationFormatDto) {
    const format = this.participationFormatsRepository.create(createDto);
    return this.participationFormatsRepository.save(format);
  }

  findAll(includeInactive = false) {
    return this.participationFormatsRepository.find({
      where: includeInactive ? {} : { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const format = await this.participationFormatsRepository.findOne({
      where: { id },
    });
    if (!format) {
      throw new NotFoundException(`Формат участия с id ${id} не найден`);
    }
    return format;
  }

  async update(id: string, updateDto: UpdateParticipationFormatDto) {
    const format = await this.findOne(id);
    return this.participationFormatsRepository.save({
      ...format,
      ...updateDto,
    });
  }

  async remove(id: string) {
    const format = await this.findOne(id);
    await this.participationFormatsRepository.remove(format);
  }
}
