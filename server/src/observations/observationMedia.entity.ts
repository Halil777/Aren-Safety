import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Observation } from './observation.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';

export enum ObservationMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

@Entity('observation_media')
export class ObservationMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  observationId: string;

  @ManyToOne(() => Observation, observation => observation.media, {
    onDelete: 'CASCADE',
  })
  observation: Observation;

  @Column({ type: 'enum', enum: ObservationMediaType, enumName: 'observation_media_type_enum' })
  type: ObservationMediaType;

  @Column()
  url: string;

  @Column()
  uploadedByUserId: string;

  @ManyToOne(() => MobileAccount, {
    onDelete: 'CASCADE',
  })
  uploadedBy: MobileAccount;

  @Column({ default: false })
  isCorrective: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
