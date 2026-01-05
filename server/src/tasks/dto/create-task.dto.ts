import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../task-status';
import { TaskAttachmentType } from '../taskAttachment.entity';

class TaskMediaInputDto {
  @IsEnum(TaskAttachmentType)
  type: TaskAttachmentType;

  @IsString()
  url: string;

  @IsOptional()
  isCorrective?: boolean;
}

export class CreateTaskDto {
  @IsOptional()
  @IsUUID()
  createdByUserId?: string;

  @IsUUID()
  projectId: string;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  supervisorId: string;

  @IsString()
  @Length(2, 2000)
  description: string;

  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskMediaInputDto)
  media?: TaskMediaInputDto[];
}
