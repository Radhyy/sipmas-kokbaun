import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "../globals.css";

import PublicNavbar from "./PublicNavbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />

      {children}

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} SIPMAS KOKBAUN - Kecamatan Kokbaun, Timor Tengah Selatan.</p>
          <p style={{ marginTop: "0.5rem", color: "rgba(255,255,255,0.7)" }}>Mewujudkan pelayanan publik yang transparan dan akuntabel.</p>
        </div>
      </footer>
    </>
  );
}
