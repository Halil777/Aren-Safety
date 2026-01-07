import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('api/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    console.log('Received support message:', JSON.stringify(createMessageDto, null, 2));
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  async findAll() {
    return this.messagesService.findAll();
  }

  @Get('unread-count')
  async getUnreadCount() {
    return { count: await this.messagesService.countUnread() };
  }

  @Patch('mark-read')
  async markAllRead() {
    await this.messagesService.markAllRead();
    return { success: true };
  }
}
