import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationFormatsService } from './participation-formats.service';
import { ParticipationFormatsController } from './participation-formats.controller';
import { ParticipationFormat } from './entities/participation-format.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipationFormat]), AuthModule],
  providers: [ParticipationFormatsService],
  controllers: [ParticipationFormatsController],
  exports: [ParticipationFormatsService, TypeOrmModule],
})
export class ParticipationFormatsModule {}
