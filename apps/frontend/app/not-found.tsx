import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="glass max-w-md p-10 text-center">
        <p className="text-6xl font-bold">404</p>
        <p className="mt-3 text-white/70">The page you requested does not exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-white/10 px-4 py-2">
          Return Home
        </Link>
      </div>
    </main>
  );
}
