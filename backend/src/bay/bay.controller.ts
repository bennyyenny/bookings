import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BayService } from './bay.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Controller('bays')
export class BayController {
  constructor(private readonly bayService: BayService) {}

  @Post()
  create(@Body() body: { name: string; venueId: number }) {
    return this.bayService.create({
      name: body.name,
      venue: { connect: { id: body.venueId } },
    });
  }

  @Get()
  findAll() {
    return this.bayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bayService.findById(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; venueId?: number },
  ) {
    const data: Prisma.BayUpdateInput = { name: body.name };
    if (body.venueId) data.venue = { connect: { id: body.venueId } };
    return this.bayService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bayService.remove(Number(id));
  }

  @Get('venue/:venueId')
  findByVenue(@Param('venueId') venueId: string) {
    return this.bayService.findByVenue(Number(venueId));
  }
}
