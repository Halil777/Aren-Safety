import { PartialType } from '@nestjs/mapped-types';
import { CreateMobileAccountDto } from './create-mobile-account.dto';

export class UpdateMobileAccountDto extends PartialType(CreateMobileAccountDto) {}
