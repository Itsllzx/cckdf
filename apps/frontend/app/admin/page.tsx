import { GlassCard } from '@/components/GlassCard';
import { NavBar } from '@/components/NavBar';

export default function AdminPage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto mt-10 grid w-[95%] max-w-6xl gap-4 md:grid-cols-3">
        <GlassCard>
          <h3 className="font-semibold">Manage Users</h3>
          <p className="mt-2 text-sm text-white/70">View, promote, or deactivate user accounts.</p>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold">Analytics Overview</h3>
          <p className="mt-2 text-sm text-white/70">Track API trends and engagement in real time.</p>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold">System Logs</h3>
          <p className="mt-2 text-sm text-white/70">Review audit logs captured by Winston logger.</p>
        </GlassCard>
      </section>
    </main>
  );
}
