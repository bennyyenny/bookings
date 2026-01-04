"use client";

type Bay = { id: number; name: string };

export default function BayList({
  bays,
  onDelete,
}: {
  bays: Bay[];
  onDelete: (id: number) => void;
}) {
  return (
    <ul className="space-y-2">
      {bays.map((bay) => (
        <li key={bay.id} className="flex justify-between border p-2">
          <span>{bay.name}</span>
          <button
            onClick={() => onDelete(bay.id)}
            className="text-red-500 font-bold"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
