// This is the homepage shown at http://localhost:3000
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Digi2 Platform</p>

        <h1>Digital Tools for Handyman Businesses</h1>

        <p className="heroText">
          Digi2 helps service businesses manage profiles, prepare websites,
          and grow through modern digital systems.
        </p>

        <Link className="button" href="/dashboard">
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}