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
    <html
      lang='en'
      className='light'
      style={{ colorScheme: 'light', scrollBehavior: 'smooth', scrollbarGutter: 'stable' }}
    >
      <body className={cn(inter.className, 'smooth-scroll overflow-auto w-full h-min-screen')}>
        <QueryClientProvider>
          <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
            {children}
            <Toaster position='top-right' />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
