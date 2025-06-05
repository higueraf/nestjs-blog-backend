import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { service: string; status: boolean } {
    return {
      service: 'nestjs-blog-backend-api',
      status: true,
    };
  }
}
