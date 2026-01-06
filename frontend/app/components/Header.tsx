"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

interface HeaderProps {
  venueSlug: string;
  venueId?: string | number;
}

export default function Header({ venueSlug, venueId }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between p-4 border-b">
      <nav className="flex gap-4">
        <Link href={`/venue/${venueSlug}`}>Calendar</Link>
        <Link href={`/venue/${venueSlug}/bays`}>Bays</Link>
        <Link href={`/venue/${venueSlug}/bookings`}>Bookings</Link>
        <Link href={`/venue/${venueSlug}/settings`}>Settings</Link>
      </nav>

      <div className="flex gap-4 items-center">
        {venueId && (
          <span className="text-sm text-gray-500">Venue ID: {venueId}</span>
        )}

        {session ? (
          <button
            onClick={() => signOut()}
            className="px-3 py-1 border rounded"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-3 py-1 border rounded"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
