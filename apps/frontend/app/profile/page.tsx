import { GlassCard } from '@/components/GlassCard';
import { NavBar } from '@/components/NavBar';

export default function ProfilePage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto mt-10 w-[95%] max-w-3xl">
        <GlassCard>
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
          <p className="mt-4 text-white/70">Update your identity, avatar, and password from secure account endpoints.</p>
        </GlassCard>
      </section>
    </main>
  );
}
