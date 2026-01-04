import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { VenueService } from './venue.service.js';

@Controller('venues')
export class VenueController {
  constructor(private venueService: VenueService) {}

  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.venueService.create(body);
  }

  @Get()
  findAll() {
    return this.venueService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.venueService.findBySlug(slug);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; slug?: string },
  ) {
    return this.venueService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venueService.remove(Number(id));
  }
}
