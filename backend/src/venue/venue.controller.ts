import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { VenueService } from './venue.service.js';

@Controller('venues')
export class VenueController {
  constructor(private venueService: VenueService) {}

  // -----------------------------
  // Create a venue (staff/admin only)
  // -----------------------------
  @Post()
  async create(
    @Body() body: { name: string; slug: string },
    @Req() req: any, // auth middleware sets req.user
  ) {
    const userId = Number(req.user?.id);
    const companyId = Number(req.user?.companyId); // get companyId from auth

    if (!userId || !companyId) {
      throw new Error('User not authorized to create a venue');
    }

    return this.venueService.createVenueWithUser(userId, companyId, body);
  }

  // -----------------------------
  // Get all venues
  // -----------------------------
  @Get()
  findAll() {
    return this.venueService.findAll();
  }

  // -----------------------------
  // Get one venue by slug (requires company)
  // -----------------------------
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Req() req: any) {
    const companyId = Number(req.user?.companyId); // get companyId from auth

    if (!companyId) throw new Error('Company context required');

    return this.venueService.findBySlug(slug, companyId);
  }

  // -----------------------------
  // Update a venue by ID
  // -----------------------------
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; slug?: string },
  ) {
    return this.venueService.update(Number(id), body);
  }

  // -----------------------------
  // Delete a venue by ID
  // -----------------------------
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venueService.remove(Number(id));
  }
}
