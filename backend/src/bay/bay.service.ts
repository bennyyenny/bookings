import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Prisma, Bay } from '../generated/prisma/client.js';

@Injectable()
export class BayService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.BayCreateInput): Promise<Bay> {
    return this.prisma.bay.create({
      data,
      include: { venue: true },
    });
  }

  findAll(): Promise<Bay[]> {
    return this.prisma.bay.findMany({ include: { venue: true } });
  }

  findById(id: number): Promise<Bay | null> {
    return this.prisma.bay.findUnique({
      where: { id },
      include: { venue: true },
    });
  }

  update(id: number, data: Prisma.BayUpdateInput): Promise<Bay> {
    return this.prisma.bay.update({
      where: { id },
      data,
      include: { venue: true },
    });
  }

  remove(id: number): Promise<Bay> {
    return this.prisma.bay.delete({ where: { id } });
  }

  findByVenue(venueId: number): Promise<Bay[]> {
    return this.prisma.bay.findMany({
      where: { venueId },
      include: { venue: true },
    });
  }
}
