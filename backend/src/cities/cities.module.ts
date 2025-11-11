import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from './entities/city.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([City]), AuthModule],
  providers: [CitiesService],
  controllers: [CitiesController],
  exports: [CitiesService, TypeOrmModule],
})
export class CitiesModule {}
