import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { service: string; version: string, status: boolean } {
    return {
      service: 'nestjs-blog-backend-api-CI-CD',
      version: '0.0.2',
      status: true,
    };
  }
}
