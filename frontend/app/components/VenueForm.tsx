// components/VenueForm.tsx
"use client";

import { useActionState } from "react"; // React 19 / Next 15+ (or useFormState in older)
import { createVenueAction } from "@/actions/venueActions"; // we'll define this
import { useRef } from "react"; // optional: to reset form

type Props = {
  companySlug: string;
};

export default function VenueForm({ companySlug }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  // useActionState gives pending/error/success state automatically
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      // We can wrap the server action here if needed, but usually just pass it directly
      return await createVenueAction(prevState, formData);
    },
    { message: null, error: null } // initial state
  );

  // Optional: reset form on success
  if (state?.success) {
    formRef.current?.reset();
  }

  return (
    <form action={formAction} ref={formRef} className="space-y-4">
      {/* Hidden input to pass company slug — secure way via bind or hidden field */}
      <input type="hidden" name="companySlug" value={companySlug} />

      <div>
        <label htmlFor="name">Venue Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          required
          className="border p-2 w-full"
        />
      </div>

      {/* Add more fields: city, capacity, description, image upload, etc. */}

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Venue"}
      </button>

      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.message && <p className="text-green-600">{state.message}</p>}
    </form>
  );
}
