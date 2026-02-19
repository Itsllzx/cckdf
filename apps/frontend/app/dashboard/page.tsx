import { GlassCard } from '@/components/GlassCard';
import { NavBar } from '@/components/NavBar';

const stats = [
  { label: 'Active Sessions', value: '1,284' },
  { label: 'Requests Today', value: '42,901' },
  { label: 'Error Rate', value: '0.21%' }
];

export default function DashboardPage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto mt-10 w-[95%] max-w-6xl space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <GlassCard key={stat.label}>
              <p className="text-sm text-white/70">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard>
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <p className="mt-3 text-white/70">Live activity stream is available from the backend /activity endpoint.</p>
        </GlassCard>
      </section>
    </main>
  );
}
