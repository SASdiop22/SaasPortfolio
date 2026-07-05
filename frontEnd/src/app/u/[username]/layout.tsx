import { notFound } from 'next/navigation';
import { getPortfolio } from '@/lib/public';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';

interface LayoutProps {
  children: React.ReactNode;
  params: { username: string };
}

export default async function PublicLayout({ children, params }: LayoutProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const { user, activeTheme, socialLinks } = portfolio;
  const displayName = user.fullName ?? user.username;

  const bg = activeTheme?.backgroundColor ?? '#05091a';
  const text = activeTheme?.textColor ?? '#ffffff';

  return (
    <>
      <PublicNavbar username={params.username} displayName={displayName} theme={activeTheme ?? null} />
      <div className="min-h-screen" style={{ backgroundColor: bg, color: text }}>
        {children}
      </div>
      <PublicFooter username={params.username} user={user} socialLinks={socialLinks} theme={activeTheme ?? null} />
    </>
  );
}