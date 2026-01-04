"use client";

import { useState } from "react";

export default function BayForm({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New bay name"
        className="border p-2 flex-1"
      />
      <button className="bg-blue-500 text-white p-2 rounded">Add Bay</button>
    </form>
  );
}
