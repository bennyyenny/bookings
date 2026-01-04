import { Injectable } from '@nestjs/common';
import { Prisma, Venue } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.VenueCreateInput): Promise<Venue> {
    return this.prisma.venue.create({ data });
  }

  findAll(): Promise<Venue[]> {
    return this.prisma.venue.findMany();
  }

  findBySlug(slug: string): Promise<Venue | null> {
    return this.prisma.venue.findUnique({
      where: { slug },
    });
  }

  update(id: number, data: Prisma.VenueUpdateInput): Promise<Venue> {
    return this.prisma.venue.update({
      where: { id },
      data,
    });
  }

  remove(id: number): Promise<Venue> {
    return this.prisma.venue.delete({
      where: { id },
    });
  }
}
