"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  SlotInfo,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSession, signIn } from "next-auth/react";

type Bay = { id: number; name: string };
type Booking = {
  id: number;
  bayId: number;
  start: Date;
  end: Date;
  title: string;
  resourceId: number;
};

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingCalendarProps {
  venueSlug: string;
}

export default function BookingCalendar({ venueSlug }: BookingCalendarProps) {
  const { data: session } = useSession();
  const [venueId, setVenueId] = useState<number | null>(null);
  const [bays, setBays] = useState<Bay[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tempSlot, setTempSlot] = useState<Booking | null>(null);

  // 1️⃣ Fetch venue ID
  useEffect(() => {
    fetch(`http://localhost:3000/venues/${venueSlug}`)
      .then((res) => res.json())
      .then((venue) => setVenueId(venue.id))
      .catch(console.error);
  }, [venueSlug]);

  // 2️⃣ Fetch bays
  useEffect(() => {
    if (!venueId) return;
    fetch(`http://localhost:3000/bays/venue/${venueId}`)
      .then((res) => res.json())
      .then((data) => setBays(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [venueId]);

  // 3️⃣ Fetch bookings
  useEffect(() => {
    if (!venueId || bays.length === 0) return;
    fetch(`http://localhost:3000/bookings/venue/${venueId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mappedBookings: Booking[] = data.map((b: any) => ({
            id: b.id,
            bayId: b.bayId,
            start: new Date(b.startAt),
            end: new Date(b.endAt),
            title:
              bays.find((bay) => bay.id === b.bayId)?.name || `Bay ${b.bayId}`,
            resourceId: b.bayId,
          }));
          setBookings(mappedBookings);
        }
      })
      .catch(console.error);
  }, [venueId, bays]);

  const resources = bays.map((bay) => ({ id: bay.id, title: bay.name }));

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (!slotInfo.resourceId) return;
    const bay = bays.find((b) => b.id === slotInfo.resourceId);
    if (!bay) return;

    setTempSlot({
      id: Date.now(),
      bayId: bay.id,
      start: slotInfo.start,
      end: slotInfo.end,
      title: `New Booking - ${bay.name}`,
      resourceId: bay.id,
    });
  };

  const handleBook = async () => {
    if (!tempSlot || !venueId) return;

    // 1️⃣ Check if user is logged in
    if (!session?.user?.email) {
      signIn(); // redirect to login
      return;
    }

    try {
      // 2️⃣ Get userId from backend
      const userRes = await fetch(
        `http://localhost:3000/users/by-email/${session.user.email}`
      );
      if (!userRes.ok) throw new Error("User not found");
      const { id: userId } = await userRes.json();

      // 3️⃣ Create booking
      const bookingRes = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bayId: tempSlot.bayId,
          venueId,
          userId,
          startAt: tempSlot.start.toISOString(),
          endAt: tempSlot.end.toISOString(),
        }),
      });

      if (!bookingRes.ok) {
        const errText = await bookingRes.text();
        throw new Error(errText);
      }

      const createdBooking = await bookingRes.json();

      setBookings((prev) => [
        ...prev,
        {
          id: createdBooking.id,
          bayId: createdBooking.bayId,
          start: new Date(createdBooking.startAt),
          end: new Date(createdBooking.endAt),
          title: createdBooking.bay.name,
          resourceId: createdBooking.bayId,
        },
      ]);

      setTempSlot(null);
    } catch (err: any) {
      alert(err.message || "Booking failed");
    }
  };

  const handleIncrement = () => {
    if (!tempSlot) return;
    setTempSlot({ ...tempSlot, end: addMinutes(tempSlot.end, 15) });
  };

  const handleCancel = () => setTempSlot(null);

  return (
    <div style={{ height: 700, padding: "20px" }}>
      <Calendar
        localizer={localizer}
        events={tempSlot ? [...bookings, tempSlot] : bookings}
        resources={resources}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
        defaultView={Views.DAY}
        views={["day"]}
        selectable
        onSelectSlot={handleSelectSlot}
        step={15}
        timeslots={4}
        style={{ height: "100%" }}
      />

      {tempSlot && (
        <div
          style={{
            position: "fixed",
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            zIndex: 1000,
            minWidth: "300px",
            textAlign: "center",
          }}
        >
          <p>
            {tempSlot.start.toLocaleTimeString()} -{" "}
            {tempSlot.end.toLocaleTimeString()} (
            {Math.round(
              (tempSlot.end.getTime() - tempSlot.start.getTime()) / 60000
            )}{" "}
            minutes)
          </p>

          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={handleBook}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                background: "#3174ad",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirm Booking
            </button>
            <button
              onClick={handleIncrement}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                background: "#e0e0e0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              +15 min
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: "0.5rem 1rem",
                background: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
