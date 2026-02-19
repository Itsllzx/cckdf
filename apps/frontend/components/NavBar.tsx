import Link from 'next/link';

export function NavBar() {
  const links = [
    ['Dashboard', '/dashboard'],
    ['Profile', '/profile'],
    ['Admin', '/admin'],
    ['Login', '/login']
  ];

  return (
    <nav className="glass mx-auto mt-6 flex w-[95%] max-w-5xl items-center justify-between px-6 py-4">
      <h1 className="font-semibold">AI Glass Platform</h1>
      <div className="flex gap-4 text-sm text-white/70">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="hover:text-accent transition-colors">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
