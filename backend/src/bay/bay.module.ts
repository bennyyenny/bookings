import { Module } from '@nestjs/common';
import { BayService } from './bay.service.js';
import { BayController } from './bay.controller.js';

@Module({
  providers: [BayService],
  controllers: [BayController],
})
export class BayModule {}
