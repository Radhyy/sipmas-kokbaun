import { neon } from "@neondatabase/serverless";
import styles from "../admin.module.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FilterBar from "./FilterBar";
import Link from "next/link";
import DeleteButton from "./[id]/DeleteButton";

export const metadata = {
  title: "Semua Laporan | SIPMAS KOKBAUN",
};

export default async function SemuaLaporan(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session?.value) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const nama = searchParams.nama;
  const kategori = searchParams.kategori;
  const lokasi = searchParams.lokasi;
  const tanggal = searchParams.tanggal;

  const sql = neon(process.env.DATABASE_URL!);
  
  // Build dynamic query
  let query = "SELECT * FROM pengaduan WHERE 1=1";
  const params: any[] = [];
  
  if (nama) {
    params.push(`%${nama}%`);
    query += ` AND nama ILIKE $${params.length}`;
  }
  if (kategori) {
    params.push(kategori);
    query += ` AND kategori = $${params.length}`;
  }
  if (lokasi) {
    params.push(lokasi);
    query += ` AND lokasi = $${params.length}`;
  }
  if (tanggal) {
    params.push(tanggal);
    query += ` AND DATE(tanggal) = $${params.length}`;
  }

  query += " ORDER BY tanggal DESC";

  const result = await sql.query(query, params) as any;
  const reports = result.rows ? result.rows : result;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Semua Laporan</h1>
      </div>

      <FilterBar />

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>Daftar Keseluruhan Pengaduan Masyarakat</div>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nomor Pengaduan</th>
                <th>Tanggal</th>
                <th>Nama Pelapor</th>
                <th>Kategori</th>
                <th>Lokasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report: any) => (
                  <tr key={report.id}>
                    <td>{report.nomor_pengaduan}</td>
                    <td>{new Date(report.tanggal).toLocaleDateString("id-ID")}</td>
                    <td>{report.nama}</td>
                    <td><span className={styles.badge}>{report.kategori}</span></td>
                    <td>{report.lokasi}</td>
                    <td>
                      <span className={`${styles.badge} ${styles['badge' + (report.status || 'Terkirim')]}`}>
                        {report.status || 'Terkirim'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link href={`/admin/laporan/${report.id}`} className={styles.badge} style={{ backgroundColor: "#e2e8f0", cursor: "pointer", textDecoration: "none" }}>
                          Lihat Detail
                        </Link>
                        <DeleteButton id={report.id} iconOnly={true} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#64748b" }}>
                    Belum ada laporan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
