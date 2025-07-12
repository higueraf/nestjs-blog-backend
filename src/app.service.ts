import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { service: string; version: string, status: boolean } {
    return {
      service: 'nestjs-blog-backend-api',
      version: '2025.07.12.17.01',
      status: true,
    };
  }
}
