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

@Entity({ name: 'tariffs' })
export class Tariff {
  @ApiProperty({ description: 'Идентификатор тарифа', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Название тарифа' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Описание тарифа', nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Стоимость тарифа', nullable: true })
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value?: number | null) => value ?? null,
      from: (value?: string | null) =>
        value !== undefined && value !== null ? Number(value) : null,
    },
  })
  price?: number | null;

  @ApiProperty({ description: 'Признак активности', default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Дата создания записи' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления записи' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Application, (application) => application.tariff)
  applications: Application[];
}
