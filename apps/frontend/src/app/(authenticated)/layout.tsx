import { LayoutProvider } from '@/providers/layout-provider';
import SessionProvider from '@/providers/session-provider';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </SessionProvider>
  );
}
