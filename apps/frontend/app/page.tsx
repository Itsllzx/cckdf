import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { NavBar } from '@/components/NavBar';

export default function HomePage() {
  return (
    <main className="pb-20">
      <NavBar />
      <section className="mx-auto mt-20 grid w-[95%] max-w-5xl gap-8 md:grid-cols-2">
        <GlassCard>
          <h2 className="text-3xl font-bold">Cinema Yar · AI Glass Platform</h2>
          <p className="mt-4 text-white/70">
            Full production stack with secure JWT auth, role-based access, analytics, and modern glassmorphism UI.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/register" className="rounded-xl bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] px-4 py-2 font-medium">
              Get Started
            </Link>
            <Link href="/dashboard" className="rounded-xl border border-white/30 px-4 py-2">
              View Dashboard
            </Link>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-xl font-semibold">Built-in Production Features</h3>
          <ul className="mt-4 space-y-2 text-white/80">
            <li>• Email/password auth with refresh tokens</li>
            <li>• Admin panel with user controls and logs</li>
            <li>• Profile management + activity tracking</li>
            <li>• Fully typed frontend + backend APIs</li>
          </ul>
        </GlassCard>
      </section>
    </main>
  );
}
