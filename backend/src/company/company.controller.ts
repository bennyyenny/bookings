// src/company/company.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt-auth.guard.js';
import { CompanyService } from './company.service.js';

@Controller('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createCompany(
    @Req() req,
    @Body() body: { name: string; slug: string },
  ) {
    const userId = req.user.sub;
    return this.companyService.createCompany(userId, body.name, body.slug);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getUserCompanies(@Req() req) {
    const userId = req.user.sub;
    return this.companyService.getCompaniesForUser(userId);
  }

  // New route: get a single company by slug
  @Get(':slug')
  @UseGuards(JwtGuard)
  async getCompanyBySlug(@Param('slug') slug: string) {
    return this.companyService.getCompanyBySlug(slug);
  }
}
