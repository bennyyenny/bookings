"use client";

import { useEffect, useState } from "react";

type Venue = {
  id: number;
  name: string;
  address?: string;
};

export default function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:3000/venues");

        if (!res.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await res.json();
        setVenues(data);
      } catch (err) {
        setError("Could not load venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) return <p className="p-6">Loading venues...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Venues</h1>

      {venues.length === 0 && <p>No venues found.</p>}

      <ul className="space-y-3">
        {venues.map((venue) => (
          <li key={venue.id} className="border rounded p-4 hover:bg-gray-50">
            <h2 className="font-semibold">{venue.name}</h2>
            {venue.address && (
              <p className="text-sm text-gray-600">{venue.address}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
