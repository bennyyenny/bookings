"use client";

import { useEffect, useState } from "react";
import BayList from "@/app/components/BayList";
import BayForm from "@/app/components/BayForm";

type Bay = {
  id: number;
  name: string;
};

export default function BaysPage() {
  const [bays, setBays] = useState<Bay[]>([]);
  const [loading, setLoading] = useState(true);

  // Assume the admin is tied to venueId 1 for now
  const venueId = 1;

  const fetchBays = async () => {
    try {
      const res = await fetch(`http://localhost:3000/bays/venue/${venueId}`);
      const data = await res.json();
      setBays(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addBay = async (name: string) => {
    const res = await fetch(`http://localhost:3000/bays`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, venueId }),
    });
    const newBay = await res.json();
    setBays([...bays, newBay]);
  };

  const deleteBay = async (id: number) => {
    await fetch(`http://localhost:3000/bays/${id}`, { method: "DELETE" });
    setBays(bays.filter((bay) => bay.id !== id));
  };

  useEffect(() => {
    fetchBays();
  }, []);

  if (loading) return <p>Loading bays...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Bays</h1>

      <BayForm onSubmit={addBay} />

      <BayList bays={bays} onDelete={deleteBay} />
    </div>
  );
}
