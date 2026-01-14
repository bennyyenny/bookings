// src/company/company.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async createCompany(userId: number, name: string, slug: string) {
    return this.prisma.company.create({
      data: {
        name,
        slug,
        users: {
          create: {
            userId,
            role: 'OWNER', // the creator is the OWNER
          },
        },
      },
      include: { users: true },
    });
  }

  async getCompaniesForUser(userId: number) {
    return this.prisma.companyUser.findMany({
      where: { userId },
      include: { company: true },
    });
  }

  async getCompanyBySlug(slug: string) {
    return this.prisma.company.findUnique({
      where: { slug },
      include: { venues: true }, // optional: include venues
    });
  }
}
