"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="navbarContainer" style={{ flexDirection: 'column', alignItems: 'center' }}>
      <nav className="navbar">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Link href="/" className="logoContainer">
            <Image
              src="/LOGO-TIMOR-TENGAH-SELATAN.png"
              alt="Logo Timor Tengah Selatan"
              width={36}
              height={36}
            />
            <div className="logoText">SIPMAS KOKBAUN</div>
          </Link>
          
          <div className="navLinks desktopOnly">
            <Link href="/" className="navLink">Beranda</Link>
            <Link href="/cek-status" className="navLink">Cek Status</Link>
            <Link href="/#cara-kerja" className="navLink">Cara Kerja</Link>
          </div>
          
          <div className="navButtons desktopOnly" style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/login" className="btn" style={{ backgroundColor: "transparent", border: "1px solid #cbd5e1", color: "#334155", borderRadius: "9999px", fontSize: "0.95rem", padding: "0.6rem 1rem" }}>
              Login
            </Link>
            <Link href="/lapor" className="btn" style={{ backgroundColor: "#0f172a", color: "white", borderRadius: "9999px", fontSize: "0.95rem", padding: "0.6rem 1.25rem" }}>
              Lapor Sekarang
            </Link>
          </div>

          <div className="mobileMenuToggle" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', padding: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="mobileDropdown">
          <Link href="/" className="mobileNavLink" onClick={() => setIsOpen(false)}>Beranda</Link>
          <Link href="/cek-status" className="mobileNavLink" onClick={() => setIsOpen(false)}>Cek Status Laporan</Link>
          <Link href="/#cara-kerja" className="mobileNavLink" onClick={() => setIsOpen(false)}>Cara Kerja</Link>
          <div style={{ height: '1px', backgroundColor: '#e2e8f0' }}></div>
          <Link href="/lapor" className="mobileNavLink" style={{ color: '#16a34a', fontWeight: 800 }} onClick={() => setIsOpen(false)}>Lapor Sekarang</Link>
          <Link href="/login" className="mobileNavLink" onClick={() => setIsOpen(false)}>Login Admin</Link>
        </div>
      )}
    </div>
  );
}
