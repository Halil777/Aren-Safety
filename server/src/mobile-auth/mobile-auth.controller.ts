import { Body, Controller, Post } from '@nestjs/common';
import { MobileAuthService } from './mobile-auth.service';
import { MobileLoginDto } from './dto/mobile-login.dto';

@Controller('api/mobile-auth')
export class MobileAuthController {
  constructor(private readonly authService: MobileAuthService) {}

  @Post('login')
  login(@Body() dto: MobileLoginDto) {
    return this.authService.login(dto);
  }
}
