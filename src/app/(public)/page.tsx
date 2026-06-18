import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className={`container ${styles.hero}`}>
        {/* Decorative Logo on the left */}
        <img
          src="/LOGO-TIMOR-TENGAH-SELATAN.png"
          alt=""
          className={styles.heroLogoBackground}
        />
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Layanan <span>Pengaduan Masyarakat</span> Desa Kokbaun
          </h1>
          <p className={styles.heroDescription}>
            Sampaikan laporan, keluhan, dan aspirasi Anda dengan mudah, aman, dan transparan melalui Sistem Pengaduan Masyarakat (SIPMAS) Desa Kokbaun, Kabupaten Timor Tengah Selatan.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/lapor" className="btn btn-primary">
              Buat Laporan
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
            <Link href="#cara-kerja" className="btn btn-outline">
              Cari Tahu Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Cara Kerja */}
      <section id="cara-kerja" className={styles.features}>
        <div className="container section">
          <h2 className="section-title">Bagaimana Cara Kerjanya?</h2>
          <p className="section-subtitle">Tiga langkah mudah untuk memastikan suara Anda didengar dan ditindaklanjuti oleh pemerintah desa.</p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>1. Tulis Laporan</h3>
              <p className={styles.featureDesc}>Tuliskan keluhan atau laporan Anda secara jelas. Sertakan foto bukti jika diperlukan.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 className={styles.featureTitle}>2. Proses Verifikasi</h3>
              <p className={styles.featureDesc}>Laporan Anda akan diverifikasi oleh pihak berwenang di Desa Kokbaun untuk ditindaklanjuti.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className={styles.featureTitle}>3. Selesai & Transparan</h3>
              <p className={styles.featureDesc}>Pantau terus status laporan Anda hingga masalah dinyatakan selesai dan terpecahkan.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
