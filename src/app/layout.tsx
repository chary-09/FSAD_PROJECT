import type { Metadata } from 'next';
import { JetBrains_Mono, Orbitron } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthGuard } from '@/components/auth-guard';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'BuildoHolics HMS',
  description: 'Advanced Cyber-Noir Hotel Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${jetbrainsMono.variable} ${orbitron.variable}`}>
      <body className="font-mono antialiased bg-background selection:bg-primary selection:text-primary-foreground min-h-screen">
        <FirebaseClientProvider>
          <AuthGuard>
            <SidebarProvider>
              <div className="flex-1 flex flex-col relative">
                {children}
              </div>
              <Toaster />
            </SidebarProvider>
          </AuthGuard>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}