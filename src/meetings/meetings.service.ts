import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { CreateMeetingDto, UpdateMeetingDto, JoinMeetingDto } from './dto/meeting.dto';
import { User } from '../users/user.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingsRepository: Repository<Meeting>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByCallId(callId: string): Promise<Meeting | null> {
    const meeting = await this.meetingsRepository.findOne({
      where: { callId },
      relations: ['host', 'participants'],
    });
    return meeting ?? null;
  }

  async createOrGetByCallId(
    callId: string,
    hostId: string,
    data?: Partial<CreateMeetingDto>,
  ): Promise<Meeting> {
    const existing = await this.findByCallId(callId);
    if (existing) {
      return existing;
    }

    const host = await this.usersRepository.findOne({ where: { id: hostId } });
    if (!host) {
      throw new NotFoundException('Host user not found');
    }

    const meeting = this.meetingsRepository.create({
      title: data?.title ?? callId,
      description: data?.description,
      callId,
      status: data?.status ?? 'scheduled',
      startTime: data?.startTime ?? null,
      participantCount: 1,
      host,
      participants: [host],
    });

    return this.meetingsRepository.save(meeting);
  }

  async create(createMeetingDto: CreateMeetingDto, hostId: string): Promise<Meeting> {
    const host = await this.usersRepository.findOne({ where: { id: hostId } });
    if (!host) {
      throw new NotFoundException('Host user not found');
    }

    const meeting = this.meetingsRepository.create({
      ...createMeetingDto,
      host,
      participants: [host],
      participantCount: 1,
    });

    return this.meetingsRepository.save(meeting);
  }

  async findAll(userId: string): Promise<Meeting[]> {
    return this.meetingsRepository.find({
      where: [
        { host: { id: userId } },
        { participants: { id: userId } },
      ],
      relations: ['host', 'participants'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Meeting> {
    const meeting = await this.meetingsRepository.findOne({
      where: { id },
      relations: ['host', 'participants'],
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    // Check if user is host or participant
    const isHost = meeting.host.id === userId;
    const isParticipant = meeting.participants.some(p => p.id === userId);

    if (!isHost && !isParticipant) {
      throw new ForbiddenException('You are not authorized to view this meeting');
    }

    return meeting;
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto, userId: string): Promise<Meeting> {
    const meeting = await this.findOne(id, userId);

    // Only host can update meeting details
    if (meeting.host.id !== userId) {
      throw new ForbiddenException('Only the host can update meeting details');
    }

    Object.assign(meeting, updateMeetingDto);
    return this.meetingsRepository.save(meeting);
  }

  async joinMeeting(joinMeetingDto: JoinMeetingDto, userId: string): Promise<Meeting> {
    const meeting = await this.meetingsRepository.findOne({
      where: { id: joinMeetingDto.meetingId },
      relations: ['participants'],
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a participant
    const isAlreadyParticipant = meeting.participants.some(p => p.id === userId);
    if (!isAlreadyParticipant) {
      meeting.participants.push(user);
      meeting.participantCount = meeting.participants.length;
      await this.meetingsRepository.save(meeting);
    }

    return this.findOne(joinMeetingDto.meetingId, userId);
  }

  async startMeeting(id: string, userId: string): Promise<Meeting> {
    const meeting = await this.findOne(id, userId);

    if (meeting.host.id !== userId) {
      throw new ForbiddenException('Only the host can start the meeting');
    }

    meeting.status = 'ongoing';
    meeting.startTime = new Date();
    return this.meetingsRepository.save(meeting);
  }

  async endMeeting(id: string, userId: string): Promise<Meeting> {
    const meeting = await this.findOne(id, userId);

    if (meeting.host.id !== userId) {
      throw new ForbiddenException('Only the host can end the meeting');
    }

    meeting.status = 'completed';
    meeting.endTime = new Date();
    
    if (meeting.startTime) {
      const durationMs = meeting.endTime.getTime() - meeting.startTime.getTime();
      meeting.duration = Math.round(durationMs / (1000 * 60)); // Convert to minutes
    }

    return this.meetingsRepository.save(meeting);
  }

  async remove(id: string, userId: string): Promise<void> {
    const meeting = await this.findOne(id, userId);

    if (meeting.host.id !== userId) {
      throw new ForbiddenException('Only the host can delete the meeting');
    }

    await this.meetingsRepository.remove(meeting);
  }

  async getMeetingHistory(userId: string, limit: number = 10): Promise<Meeting[]> {
    return this.meetingsRepository.find({
      where: [
        { host: { id: userId } },
        { participants: { id: userId } },
      ],
      relations: ['host', 'participants'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}

