import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { service: string; version: string, status: boolean } {
    return {
      service: 'nestjs-blog-backend-api',
      version: '0.0.3',
      status: true,
    };
  }
}
