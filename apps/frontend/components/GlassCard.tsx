import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ className?: string }>;

export function GlassCard({ children, className = '' }: Props) {
  return <div className={`glass p-6 transition duration-300 hover:scale-[1.03] ${className}`}>{children}</div>;
}
