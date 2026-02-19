'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { GlassCard } from '@/components/GlassCard';
import { loginSchema } from '@/lib/schemas';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="mx-auto mt-20 w-[95%] max-w-md">
      <GlassCard>
        <h2 className="mb-6 text-2xl font-semibold">Login</h2>
        <AuthForm
          schema={loginSchema}
          submitLabel="Sign in"
          fields={[
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Password', type: 'password' }
          ]}
          onSubmit={async (payload) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Invalid credentials');
            router.push('/dashboard');
          }}
        />
      </GlassCard>
    </main>
  );
}
