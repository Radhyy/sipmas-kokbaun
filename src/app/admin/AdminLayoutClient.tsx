"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../actions/logout";
import styles from "./admin.module.css";
import Image from "next/image";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Backdrop */}
      <div 
        className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.backdropVisible : ""}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          {isSidebarOpen && (
            <div className={styles.sidebarLogo}>
              <Image src="/LOGO-TIMOR-TENGAH-SELATAN.png" alt="Logo" width={32} height={32} />
              <span>SIPMAS Admin</span>
            </div>
          )}
        </div>

        <nav className={styles.sidebarNav}>
          <Link 
            href="/admin" 
            className={`${styles.navItem} ${pathname === "/admin" ? styles.navItemActive : ""}`}
            onClick={() => { if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            {isSidebarOpen && <span>Beranda Dasbor</span>}
          </Link>
          
          <Link 
            href="/admin/laporan" 
            className={`${styles.navItem} ${pathname === "/admin/laporan" ? styles.navItemActive : ""}`}
            onClick={() => { if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            {isSidebarOpen && <span>Semua Laporan</span>}
          </Link>

          <Link 
            href="/admin/akun" 
            className={`${styles.navItem} ${pathname === "/admin/akun" ? styles.navItemActive : ""}`}
            onClick={() => { if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            {isSidebarOpen && <span>Pengaturan Akun</span>}
          </Link>

          <Link 
            href="/admin/notifikasi" 
            className={`${styles.navItem} ${pathname === "/admin/notifikasi" ? styles.navItemActive : ""}`}
            onClick={() => { if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            {isSidebarOpen && <span>Notifikasi Email</span>}
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={() => logoutAction()} className={styles.logoutBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <button onClick={toggleSidebar} className={styles.toggleBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div className={styles.headerRight}>
            <div className={styles.adminProfile}>
              <div className={styles.avatar}>A</div>
              <span>Admin Kokbaun</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
