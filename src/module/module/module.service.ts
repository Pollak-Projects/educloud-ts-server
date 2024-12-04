import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleService {
  getHello(): string {
    return 'Hello World!';
  }
}
