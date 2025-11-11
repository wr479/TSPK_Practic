import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { Tariff } from './entities/tariff.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tariff]), AuthModule],
  providers: [TariffsService],
  controllers: [TariffsController],
  exports: [TariffsService, TypeOrmModule],
})
export class TariffsModule {}
