import { Injectable } from '@nestjs/common';
import { Prisma, Venue } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a venue and links the creating user as admin
   */
  async createVenueWithUser(
    userId: number,
    companyId: number, // must pass the companyId now
    data: { name: string; slug: string },
  ): Promise<Venue> {
    return this.prisma.venue.create({
      data: {
        name: data.name,
        slug: data.slug,
        company: { connect: { id: companyId } }, // required relation
        users: {
          create: {
            user: { connect: { id: userId } },
            role: 'admin', // or OWNER if you prefer
          },
        },
      },
      include: {
        users: { include: { user: true } }, // optional: include linked user info
      },
    });
  }

  /**
   * Get all venues
   */
  findAll(): Promise<Venue[]> {
    return this.prisma.venue.findMany({
      include: { users: { include: { user: true } } },
    });
  }

  /**
   * Find venue by slug and companyId (compound unique)
   */
  findBySlug(slug: string, companyId: number): Promise<Venue | null> {
    return this.prisma.venue.findUnique({
      where: { companyId_slug: { companyId, slug } }, // required now
      include: { users: { include: { user: true } } },
    });
  }

  /**
   * Update venue by ID
   */
  update(id: number, data: Prisma.VenueUpdateInput): Promise<Venue> {
    return this.prisma.venue.update({ where: { id }, data });
  }

  /**
   * Delete venue by ID
   */
  remove(id: number): Promise<Venue> {
    return this.prisma.venue.delete({ where: { id } });
  }
}
