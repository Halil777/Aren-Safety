import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOk(): { status: string } {
    return { status: 'ok' };
  }
}

