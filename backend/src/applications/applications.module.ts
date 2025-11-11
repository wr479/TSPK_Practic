import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity';
import { City } from '../cities/entities/city.entity';
import { ParticipationFormat } from '../participation-formats/entities/participation-format.entity';
import { Tariff } from '../tariffs/entities/tariff.entity';
import { TelegramModule } from '../telegram/telegram.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, City, ParticipationFormat, Tariff]),
    TelegramModule,
    AuthModule,
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
