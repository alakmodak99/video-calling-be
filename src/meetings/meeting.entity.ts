import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  callId: string;

  @Column({ default: 'scheduled' })
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'int', default: 0 })
  duration: number; // in minutes

  @Column({ type: 'int', default: 0 })
  participantCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.hostedMeetings)
  host: User;

  @ManyToMany(() => User, user => user.participatedMeetings)
  @JoinTable()
  participants: User[];
}

