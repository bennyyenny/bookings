// src/company/company.module.ts
import { Module } from '@nestjs/common';
import { CompanyService } from './company.service.js';
import { CompanyController } from './company.controller.js';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService], // export if other modules need to use it
})
export class CompanyModule {}
