"use client";
import { useEffect, useState } from "react";

type User = {
  sub: number;
  name: string;
  email?: string;
};

type Company = {
  id: number;
  name: string;
  slug: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanySlug, setNewCompanySlug] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch companies after user is loaded
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user) return;

      try {
        const res = await fetch("http://localhost:3001/companies", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch companies");

        const data = await res.json();
        setCompanies(data.map((cu: any) => cu.company));
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompanies();
  }, [user]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        setCompanies([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch("http://localhost:3001/companies", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCompanyName, slug: newCompanySlug }),
      });

      if (!res.ok) throw new Error("Failed to create company");

      const newCompany = await res.json();
      setCompanies((prev) => [...prev, newCompany]);
      setNewCompanyName("");
      setNewCompanySlug("");
    } catch (err) {
      console.error(err);
      alert("Error creating company");
    }
  };

  if (loading) {
    return <div className="p-6">Loading user info...</div>;
  }

  return (
    <div className="p-6">
      {!user ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome</h1>
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Hello, {user.name} 👋</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-6"
          >
            Sign Out
          </button>

          <h2 className="text-xl font-bold mb-2">Your Companies</h2>
          {companies.length === 0 ? (
            <p>You are not part of any companies yet.</p>
          ) : (
            <ul className="mb-6">
              {companies.map((c) => (
                <li key={c.id} className="border p-2 rounded mb-2">
                  <a
                    href={`/company/${c.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {c.name} (slug: {c.slug})
                  </a>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={handleCreateCompany}
            className="border p-4 rounded max-w-md"
          >
            <h3 className="text-lg font-bold mb-2">Create a Company</h3>
            <input
              type="text"
              placeholder="Company Name"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              required
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Company Slug (unique)"
              value={newCompanySlug}
              onChange={(e) => setNewCompanySlug(e.target.value)}
              required
              className="border p-2 w-full mb-2"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create Company
            </button>
          </form>
        </>
      )}
    </div>
  );
}
