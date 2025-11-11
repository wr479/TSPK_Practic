import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { CaseEntity } from './entities/case.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CaseEntity]), AuthModule],
  providers: [CasesService],
  controllers: [CasesController],
  exports: [CasesService],
})
export class CasesModule {}
