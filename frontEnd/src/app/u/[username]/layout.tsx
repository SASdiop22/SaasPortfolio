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

  const themeStyle: React.CSSProperties = activeTheme
    ? { backgroundColor: activeTheme.backgroundColor, color: activeTheme.textColor }
    : { backgroundColor: '#05091a', color: '#ffffff' };

  return (
    <>
      <PublicNavbar username={params.username} displayName={displayName} />
      <div className="min-h-screen" style={themeStyle}>
        {children}
      </div>
      <PublicFooter username={params.username} user={user} socialLinks={socialLinks} />
    </>
  );
}