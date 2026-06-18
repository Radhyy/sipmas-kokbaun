import { neon } from "@neondatabase/serverless";
import styles from "../../admin.module.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusUpdater from "./StatusUpdater";
import DeleteButton from "./DeleteButton";

export const metadata = {
  title: "Detail Laporan | SIPMAS KOKBAUN",
};

export default async function DetailLaporan(props: { params: Promise<{ id: string }> }) {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session?.value) {
    redirect("/login");
  }

  const params = await props.params;
  const id = params.id;

  const sql = neon(process.env.DATABASE_URL!);
  
  // Get report detail
  const result = (await sql.query("SELECT * FROM pengaduan WHERE id = $1", [id])) as any;
  const reports = result.rows ? result.rows : result;
  
  if (!reports || reports.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Laporan tidak ditemukan.</h2>
        <Link href="/admin/laporan" style={{ color: '#2563eb', textDecoration: 'underline' }}>Kembali ke daftar laporan</Link>
      </div>
    );
  }

  const report = reports[0];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link href="/admin/laporan" style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Kembali
          </Link>
        </div>
        <h1 className={styles.pageTitle}>Detail Pengaduan</h1>
      </div>

      <div className={styles.detailContainer}>
        <div className={styles.detailHeader}>
          <div>
            <div className={styles.detailTitle}>{report.nomor_pengaduan}</div>
            <div className={styles.detailSubtitle}>Dikirim pada {new Date(report.tanggal).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className={styles.badge} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', backgroundColor: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32' }}>
              {report.kategori}
            </span>
          </div>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailSection}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Informasi Pelapor</h3>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nama Lengkap</div>
              <div className={styles.detailValue}>{report.nama}</div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nomor Induk Kependudukan (NIK)</div>
              <div className={styles.detailValue}>{report.nik}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>No HP / WhatsApp</div>
              <div className={styles.detailValue}>{report.hp}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Alamat Pelapor</div>
              <div className={styles.detailValue}>{report.alamat}</div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Detail Kejadian</h3>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Lokasi Kejadian</div>
              <div className={styles.detailValue}>{report.lokasi}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Uraian Pengaduan / Kerusakan</div>
              <div className={styles.detailValue} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{report.uraian}</div>
            </div>

            <div className={styles.detailItem} style={{ marginTop: '1rem' }}>
              <div className={styles.detailLabel}>Bukti Foto Lampiran</div>
              {report.bukti_url ? (
                <a href={report.bukti_url} target="_blank" rel="noopener noreferrer">
                  {/* Gunakan proxy gambar untuk mem-bypass pemblokiran ISP / masalah Referer dari ImgBB */}
                  <img 
                    src={`https://images.weserv.nl/?url=${encodeURIComponent(report.bukti_url)}`} 
                    alt="Bukti Laporan" 
                    className={styles.detailImage}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                </a>
              ) : (
                <div style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: '0.5rem' }}>Tidak ada lampiran foto.</div>
              )}
            </div>
          </div>
        </div>

        {/* Status Update Block */}
        <div style={{ marginTop: '2rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Tindakan Admin: Pembaruan Status</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Gunakan pilihan di bawah ini untuk memperbarui status penanganan pengaduan ini agar pelapor dapat mengetahuinya.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#334155' }}>Status Laporan Saat Ini:</div>
              <StatusUpdater id={report.id} initialStatus={report.status} />
            </div>
            <div>
              <DeleteButton id={report.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
