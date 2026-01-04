import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VenueController } from './venue/venue.controller.js';
import { VenueService } from './venue/venue.service.js';
import { PrismaService } from './prisma.service.js';
import { BayController } from './bay/bay.controller.js';
import { BayService } from './bay/bay.service.js';
import { BookingController } from './booking/booking.controller.js';
import { BookingService } from './booking/booking.service.js';
import { UserController } from './user/user.controller.js';
import { UserService } from './user/user.service.js';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    VenueController,
    BayController,
    BookingController,
    UserController,
  ],
  providers: [
    PrismaService,
    VenueService,
    BayService,
    BookingService,
    UserService,
  ],
})
export class AppModule {}
