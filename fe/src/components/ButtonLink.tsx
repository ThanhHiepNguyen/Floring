import Link from 'next/link';

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
}: ButtonLinkProps) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors';
  const styles =
    variant === 'primary'
      ? 'bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-200'
      : 'border border-zinc-200 bg-transparent text-foreground hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900';

  return (
    <Link href={href} className={[base, styles, className].filter(Boolean).join(' ')}>
      {children}
    </Link>
  );
}

