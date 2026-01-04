"use client";

import BookingCalendar from "@/app/components/BookingCalender";
import { useParams } from "next/navigation";

export default function VenueCalendarPage() {
  const params = useParams();
  const venueSlug = params.venueSlug as string;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Venue Calendar</h1>
      <BookingCalendar venueSlug={venueSlug} />
    </div>
  );
}
