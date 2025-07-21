import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { service: string; version: string, status: boolean } {
    return {
      service: 'nestjs-blog-backend-api',
      version: '2025.07.21.15.20',
      status: true,
    };
  }
}
