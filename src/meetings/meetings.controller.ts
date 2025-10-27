import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, UpdateMeetingDto, JoinMeetingDto } from './dto/meeting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto, @Request() req) {
    return this.meetingsService.create(createMeetingDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req) {
    return this.meetingsService.findAll(req.user.id);
  }

  @Get('history')
  async getHistory(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.meetingsService.getMeetingHistory(req.user.id, limitNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.meetingsService.findOne(id, req.user.id);
  }

  // Manage by callId - helpful for FE joining via call URL
  @Get('by-call/:callId')
  async findByCallId(@Param('callId') callId: string, @Request() req) {
    const meeting = await this.meetingsService.findByCallId(callId);
    if (!meeting) {
      return null;
    }
    // findOne will also assert access; reuse logic
    return this.meetingsService.findOne(meeting.id, req.user.id);
  }

  @Post('by-call/:callId')
  async createOrGetByCallId(
    @Param('callId') callId: string,
    @Body() body: Partial<CreateMeetingDto>,
    @Request() req,
  ) {
    return this.meetingsService.createOrGetByCallId(callId, req.user.id, body);
  }

  @Post('by-call/:callId/join')
  async joinByCallId(@Param('callId') callId: string, @Request() req) {
    const meeting = await this.meetingsService.findByCallId(callId);
    if (!meeting) {
      // auto create as scheduled if missing
      const created = await this.meetingsService.createOrGetByCallId(callId, req.user.id, {});
      return this.meetingsService.joinMeeting({ meetingId: created.id }, req.user.id);
    }
    return this.meetingsService.joinMeeting({ meetingId: meeting.id }, req.user.id);
  }

  @Post('by-call/:callId/start')
  async startByCallId(@Param('callId') callId: string, @Request() req) {
    const meeting = await this.meetingsService.findByCallId(callId);
    if (!meeting) {
      const created = await this.meetingsService.createOrGetByCallId(callId, req.user.id, {});
      return this.meetingsService.startMeeting(created.id, req.user.id);
    }
    return this.meetingsService.startMeeting(meeting.id, req.user.id);
  }

  @Post('by-call/:callId/end')
  async endByCallId(@Param('callId') callId: string, @Request() req) {
    const meeting = await this.meetingsService.findByCallId(callId);
    if (!meeting) {
      const created = await this.meetingsService.createOrGetByCallId(callId, req.user.id, {});
      return this.meetingsService.endMeeting(created.id, req.user.id);
    }
    return this.meetingsService.endMeeting(meeting.id, req.user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto, @Request() req) {
    return this.meetingsService.update(id, updateMeetingDto, req.user.id);
  }

  @Post(':id/join')
  async joinMeeting(@Param('id') id: string, @Request() req) {
    return this.meetingsService.joinMeeting({ meetingId: id }, req.user.id);
  }

  @Post(':id/start')
  async startMeeting(@Param('id') id: string, @Request() req) {
    return this.meetingsService.startMeeting(id, req.user.id);
  }

  @Post(':id/end')
  async endMeeting(@Param('id') id: string, @Request() req) {
    return this.meetingsService.endMeeting(id, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.meetingsService.remove(id, req.user.id);
    return { message: 'Meeting deleted successfully' };
  }
}

