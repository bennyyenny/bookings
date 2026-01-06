import Header from "@/app/components/Header";

// Example: fetch venue info from your backend
async function getVenueBySlug(slug: string) {
  const res = await fetch(`http://localhost:3000/venues/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load venue");
  return res.json(); // { id, name, slug, ... }
}

export default async function VenueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ venueSlug: string }>;
}) {
  const { venueSlug } = await params;
  const venue = await getVenueBySlug(venueSlug);

  return (
    <>
      <Header venueSlug={venueSlug} venueId={venue.id} />
      <main>{children}</main>
    </>
  );
}
