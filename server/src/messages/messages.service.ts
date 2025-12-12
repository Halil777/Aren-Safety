import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';
import { MailService } from '../notifications/mail.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly mailService: MailService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messagesRepository.create({
      ...createMessageDto,
      status: 'new',
    });
    const saved = await this.messagesRepository.save(message);
    await this.mailService.sendSupportNotification(saved);
    return saved;
  }

  async findAll(): Promise<Message[]> {
    return this.messagesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async countUnread(): Promise<number> {
    return this.messagesRepository.count({ where: { status: 'new' } });
  }

  async markAllRead(): Promise<void> {
    await this.messagesRepository
      .createQueryBuilder()
      .update(Message)
      .set({ status: 'read' })
      .where('status = :status', { status: 'new' })
      .execute();
  }
}
