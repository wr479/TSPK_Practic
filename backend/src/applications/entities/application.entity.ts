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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ApplicationType })
  type: ApplicationType;

  @Column({ nullable: true })
  fullName?: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ManyToOne(() => City, (city) => city.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'city_id' })
  city?: City;

  @ManyToOne(() => ParticipationFormat, (format) => format.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'participation_format_id' })
  participationFormat?: ParticipationFormat;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  contactPerson?: string;

  @ManyToOne(() => Tariff, (tariff) => tariff.applications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tariff_id' })
  tariff?: Tariff;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

