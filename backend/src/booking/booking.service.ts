import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Prisma, Booking, BookingStatus } from '../generated/prisma/client.js';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    const bayId = data.bay?.connect?.id;
    const userId = data.user?.connect?.id;
    const venueId = data.venue?.connect?.id;

    if (!bayId || !userId || !venueId) {
      throw new BadRequestException('User, Bay, and Venue must be connected.');
    }

    const startAt = new Date(data.startAt as unknown as string);
    const endAt = new Date(data.endAt as unknown as string);

    if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
      throw new BadRequestException(
        `Invalid date: startAt=${data.startAt}, endAt=${data.endAt}`,
      );
    }

    // Check if bay is available
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        bayId,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });

    if (overlapping) {
      throw new BadRequestException(
        'Bay is already booked for this time range.',
      );
    }

    if (!data.status) {
      data.status = BookingStatus.CONFIRMED;
    }

    return this.prisma.booking.create({
      data: {
        ...data,
        startAt,
        endAt,
      },
      include: { user: true, bay: true, venue: true },
    });
  }

  findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      include: { user: true, bay: true, venue: true },
    });
  }

  findOne(id: number): Promise<Booking | null> {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, bay: true, venue: true },
    });
  }

  findByVenue(venueId: number): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { venueId },
      include: { user: true, bay: true },
    });
  }

  findByUser(userId: number): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { bay: true, venue: true },
    });
  }

  findByBay(bayId: number): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { bayId },
      include: { user: true, venue: true },
    });
  }

  update(id: number, data: Prisma.BookingUpdateInput): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data,
      include: { user: true, bay: true, venue: true },
    });
  }

  remove(id: number): Promise<Booking> {
    return this.prisma.booking.delete({ where: { id } });
  }
}
