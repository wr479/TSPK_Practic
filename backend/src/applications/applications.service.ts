import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyApplicationDto } from './dto/create-company-application.dto';
import { CreateIndividualApplicationDto } from './dto/create-individual-application.dto';
import { Application, ApplicationType } from './entities/application.entity';
import { City } from '../cities/entities/city.entity';
import { ParticipationFormat } from '../participation-formats/entities/participation-format.entity';
import { Tariff } from '../tariffs/entities/tariff.entity';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(ParticipationFormat)
    private readonly participationFormatsRepository: Repository<ParticipationFormat>,
    @InjectRepository(Tariff)
    private readonly tariffsRepository: Repository<Tariff>,
    private readonly telegramService: TelegramService,
  ) {}

  async createIndividual(
    dto: CreateIndividualApplicationDto,
  ): Promise<Application> {
    const [city, participationFormat] = await Promise.all([
      this.cityRepository.findOne({ where: { id: dto.cityId } }),
      this.participationFormatsRepository.findOne({
        where: { id: dto.participationFormatId },
      }),
    ]);

    if (!city) {
      throw new NotFoundException('Город не найден');
    }

    if (!participationFormat) {
      throw new NotFoundException('Формат участия не найден');
    }

    const application = this.applicationsRepository.create({
      type: ApplicationType.INDIVIDUAL,
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      comment: dto.comment,
      city,
      participationFormat,
    });

    const saved = await this.applicationsRepository.save(application);
    await this.sendTelegram(saved);
    return this.withRelations(saved.id);
  }

  async createCompany(dto: CreateCompanyApplicationDto): Promise<Application> {
    const tariff = await this.tariffsRepository.findOne({
      where: { id: dto.tariffId },
    });

    if (!tariff) {
      throw new NotFoundException('Тариф не найден');
    }

    const application = this.applicationsRepository.create({
      type: ApplicationType.COMPANY,
      companyName: dto.companyName,
      contactPerson: dto.contactPerson,
      phone: dto.phone,
      email: dto.email,
      comment: dto.comment,
      tariff,
    });

    const saved = await this.applicationsRepository.save(application);
    await this.sendTelegram(saved);
    return this.withRelations(saved.id);
  }

  async findAll(type?: ApplicationType): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: type ? { type } : undefined,
      relations: {
        city: true,
        participationFormat: true,
        tariff: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async withRelations(id: string): Promise<Application> {
    const entity = await this.applicationsRepository.findOne({
      where: { id },
      relations: {
        city: true,
        participationFormat: true,
        tariff: true,
      },
    });

    if (!entity) {
      throw new NotFoundException('Заявка не найдена');
    }

    return entity;
  }

  private async sendTelegram(application: Application) {
    await this.telegramService.notifyNewApplication({
      type: application.type,
      fullName: application.fullName,
      phone: application.phone,
      email: application.email,
      city: application.city?.name,
      participationFormat: application.participationFormat?.name,
      companyName: application.companyName,
      contactPerson: application.contactPerson,
      tariff: application.tariff?.name,
      comment: application.comment,
      createdAt: application.createdAt.toISOString(),
    });
  }
}
