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

@Entity({ name: 'cities' })
export class City {
  @ApiProperty({
    description: 'Идентификатор города',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Название города' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Признак активности', default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Дата создания записи' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления записи' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Application, (application) => application.city)
  applications: Application[];
}
