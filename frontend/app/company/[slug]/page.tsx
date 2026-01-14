// app/company/[slug]/page.tsx  (this can stay a Server Component)
import { use } from "react"; // if needed in child client comp
import VenueForm from "@/components/VenueForm"; // we'll create this

type Props = { params: Promise<{ slug: string }> };

export default async function CompanyDashboard({ params }: Props) {
  const { slug } = await params; // ← key fix!

  // Fetch company data server-side if needed
  // const company = await getCompany(slug);

  return (
    <div>
      <h1>Company Dashboard: {slug}</h1>

      {/* Other dashboard stuff... */}

      <section>
        <h2>Create New Venue</h2>
        <VenueForm companySlug={slug} /> {/* Pass slug down */}
      </section>
    </div>
  );
}
