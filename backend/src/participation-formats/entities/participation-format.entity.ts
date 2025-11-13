import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity({ name: 'participation_formats' })
export class ParticipationFormat {
  @ApiProperty({ description: 'Идентификатор формата участия', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Название формата участия' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Описание формата', nullable: true })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'Признак активности', default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Дата создания записи' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления записи' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(
    () => Application,
    (application) => application.participationFormat,
  )
  applications: Application[];
}
