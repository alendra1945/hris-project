import { QueryClientProvider } from '@/providers/query-client-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-providers';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HRIS',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='light' style={{ colorScheme: 'light' }}>
      <body className={cn(inter.className)}>
        <QueryClientProvider>
          <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
            {children}
            <Toaster position='bottom-left' />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
