import '../app/global.css';
import type { Metadata } from 'next';
import Providers from './providers';
import { Shell } from '@/components/Shell';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
export const metadata: Metadata = {
  title: 'Аяллын блог',
  description: 'Next.js дээр ажиллах хувилбар',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
