import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CaseEntity } from './entities/case.entity';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(CaseEntity)
    private readonly casesRepository: Repository<CaseEntity>,
  ) {}

  create(dto: CreateCaseDto) {
    const entity = this.casesRepository.create(dto);
    return this.casesRepository.save(entity);
  }

  findPublished() {
    return this.casesRepository.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });
  }

  findAll() {
    return this.casesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.casesRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Кейс с id ${id} не найден`);
    }
    return entity;
  }

  async update(id: string, dto: UpdateCaseDto) {
    const entity = await this.findOne(id);
    return this.casesRepository.save({
      ...entity,
      ...dto,
    });
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.casesRepository.remove(entity);
  }
}
