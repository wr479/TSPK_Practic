import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../../cities/entities/city.entity';
import { ParticipationFormat } from '../../participation-formats/entities/participation-format.entity';
import { Tariff } from '../../tariffs/entities/tariff.entity';

export enum ApplicationType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Entity({ name: 'applications' })
export class Application {
  @ApiProperty({ description: 'Идентификатор заявки', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Тип заявки', enum: ApplicationType })
  @Column({ type: 'enum', enum: ApplicationType })
  type: ApplicationType;

  @ApiProperty({ description: 'Полное имя участника', nullable: true })
  @Column({ nullable: true })
  fullName?: string;

  @ApiProperty({ description: 'Контактный телефон' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'Электронная почта' })
  @Column()
  email: string;

  @ApiProperty({ description: 'Комментарий к заявке', nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ApiProperty({
    description: 'Выбранный город',
    type: () => City,
    nullable: true,
  })
  @ManyToOne(() => City, (city) => city.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'city_id' })
  city?: City;

  @ApiProperty({
    description: 'Выбранный формат участия',
    type: () => ParticipationFormat,
    nullable: true,
  })
  @ManyToOne(() => ParticipationFormat, (format) => format.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'participation_format_id' })
  participationFormat?: ParticipationFormat;

  @ApiProperty({ description: 'Название компании', nullable: true })
  @Column({ nullable: true })
  companyName?: string;

  @ApiProperty({ description: 'Контактное лицо компании', nullable: true })
  @Column({ nullable: true })
  contactPerson?: string;

  @ApiProperty({
    description: 'Выбранный тариф',
    type: () => Tariff,
    nullable: true,
  })
  @ManyToOne(() => Tariff, (tariff) => tariff.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tariff_id' })
  tariff?: Tariff;

  @ApiProperty({ description: 'Дата создания заявки' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
