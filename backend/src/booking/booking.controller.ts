import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(
    @Body()
    body: {
      userId: number;
      bayId: number;
      venueId: number;
      startAt: string;
      endAt: string;
    },
  ) {
    const { userId, bayId, venueId, startAt, endAt } = body;

    return this.bookingService.create({
      user: { connect: { id: userId } },
      bay: { connect: { id: bayId } },
      venue: { connect: { id: venueId } },
      startAt: new Date(startAt),
      endAt: new Date(endAt),
    });
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(Number(id));
  }

  @Get('venue/:venueId')
  findByVenue(@Param('venueId') venueId: string) {
    return this.bookingService.findByVenue(Number(venueId));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Prisma.BookingUpdateInput) {
    return this.bookingService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(Number(id));
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.bookingService.findByUser(Number(userId));
  }

  @Get('bay/:bayId')
  findByBay(@Param('bayId') bayId: string) {
    return this.bookingService.findByBay(Number(bayId));
  }
}
