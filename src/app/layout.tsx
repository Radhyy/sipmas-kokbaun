import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIPMAS KOKBAUN | Sistem Pengaduan Masyarakat",
  description: "Layanan Pengaduan Masyarakat Online untuk Desa Kokbaun, Timor Tengah Selatan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
