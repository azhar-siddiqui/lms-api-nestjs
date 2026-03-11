import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string } {
    return {
      message:
        'Hello World! This is a learning management API built with NestJS.',
    };
  }
}
