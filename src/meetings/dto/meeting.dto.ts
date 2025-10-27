import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsInt, Min } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  callId: string;

  @IsOptional()
  @IsEnum(['scheduled', 'ongoing', 'completed', 'cancelled'])
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  participantCount?: number;
}

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['scheduled', 'ongoing', 'completed', 'cancelled'])
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  participantCount?: number;
}

export class JoinMeetingDto {
  @IsUUID()
  meetingId: string;
}

