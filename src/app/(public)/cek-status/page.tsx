import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import styles from "./status.module.css";
import CekStatusForm from "./CekStatusForm";

export const metadata = {
  title: "Cek Status Laporan | SIPMAS KOKBAUN",
  description: "Lacak status penanganan laporan pengaduan masyarakat Kecamatan Kokbaun.",
};

export default async function CekStatusPage(props: { searchParams: Promise<{ nomor?: string }> }) {
  const searchParams = await props.searchParams;
  const nomor = searchParams.nomor;
  
  let report = null;
  let error = null;

  if (nomor) {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const result = (await sql.query("SELECT nomor_pengaduan, tanggal, kategori, lokasi, status FROM pengaduan WHERE nomor_pengaduan = $1", [nomor])) as any;
      const rows = result.rows ? result.rows : result;
      
      if (rows && rows.length > 0) {
        report = rows[0];
      } else {
        error = "Nomor Pengaduan tidak ditemukan. Pastikan Anda memasukkan nomor yang benar.";
      }
    } catch (err) {
      console.error(err);
      error = "Terjadi kesalahan saat mencari data. Silakan coba lagi nanti.";
    }
  }

  const getStatusColor = (s: string) => {
    switch(s) {
      case "Terkirim": return { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };
      case "Diproses": return { bg: "#fef3c7", text: "#d97706", border: "#fde68a" };
      case "Selesai": return { bg: "#dcfce7", text: "#16a34a", border: "#bbf7d0" };
      default: return { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className={styles.title}>Cek Status Laporan</h1>
          <p className={styles.subtitle}>
            Pantau sejauh mana laporan Anda telah ditindaklanjuti oleh perangkat desa.
          </p>

          <div className={styles.card}>
            <CekStatusForm />

            {error && (
              <div className={styles.errorAlert}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}

            {report && (
              <div className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <div>
                    <div className={styles.resultLabel}>NOMOR PENGADUAN</div>
                    <div className={styles.resultValue} style={{ fontSize: '1.25rem', fontWeight: 800 }}>{report.nomor_pengaduan}</div>
                  </div>
                  <div>
                    <span 
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: getStatusColor(report.status || "Terkirim").bg,
                        color: getStatusColor(report.status || "Terkirim").text,
                        borderColor: getStatusColor(report.status || "Terkirim").border
                      }}
                    >
                      {report.status || "Terkirim"}
                    </span>
                  </div>
                </div>

                <div className={styles.resultGrid}>
                  <div>
                    <div className={styles.resultLabel}>KATEGORI</div>
                    <div className={styles.resultValue}>{report.kategori}</div>
                  </div>
                  <div>
                    <div className={styles.resultLabel}>LOKASI KEJADIAN</div>
                    <div className={styles.resultValue}>{report.lokasi}</div>
                  </div>
                  <div>
                    <div className={styles.resultLabel}>TANGGAL LAPORAN</div>
                    <div className={styles.resultValue}>
                      {new Date(report.tanggal).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    Informasi identitas pelapor dan detail uraian disembunyikan demi menjaga privasi dan keamanan data Anda.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
