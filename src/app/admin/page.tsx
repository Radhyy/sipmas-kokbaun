import { neon } from "@neondatabase/serverless";
import styles from "./admin.module.css";
import { cookies } from "next/headers";
import DeleteButton from "./laporan/[id]/DeleteButton";
import { redirect } from "next/navigation";
import DashboardCharts from "./DashboardCharts";
import Link from "next/link";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session?.value) {
    redirect("/login");
  }

  const sql = neon(process.env.DATABASE_URL!);
  
  // Metrik Kartu Atas
  const totalReportsRes = await sql`SELECT COUNT(*) as count FROM pengaduan`;
  const totalReports = totalReportsRes[0].count;

  const todayReportsRes = await sql`SELECT COUNT(*) as count FROM pengaduan WHERE DATE(tanggal) = CURRENT_DATE`;
  const todayReports = todayReportsRes[0].count;

  const weekReportsRes = await sql`SELECT COUNT(*) as count FROM pengaduan WHERE tanggal >= CURRENT_DATE - INTERVAL '7 days'`;
  const weekReports = weekReportsRes[0].count;

  const photoReportsRes = await sql`SELECT COUNT(*) as count FROM pengaduan WHERE bukti_url IS NOT NULL AND bukti_url != ''`;
  const photoReports = photoReportsRes[0].count;

  // Data Kategori (Pie Chart)
  const categoryRaw = await sql`SELECT kategori as name, CAST(COUNT(*) AS INTEGER) as value FROM pengaduan GROUP BY kategori`;
  const categoryData = categoryRaw.length > 0 ? categoryRaw : [{ name: "Belum ada data", value: 1 }];

  // Data Harian (Bar Chart) - 7 Hari Terakhir
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0,0,0,0);
  
  const recentWeekReports = await sql`SELECT tanggal FROM pengaduan WHERE tanggal >= ${weekAgo.toISOString()}`;
  
  // Buat array 7 hari terakhir
  const days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      fullDate: d.toDateString(),
      label: d.toLocaleDateString("id-ID", { weekday: 'short', day: 'numeric', month: 'short' }), // "Sen, 18 Jun"
      count: 0
    };
  });

  recentWeekReports.forEach((r: any) => {
     const rDate = new Date(r.tanggal).toDateString();
     const match = days.find(d => d.fullDate === rDate);
     if (match) match.count++;
  });

  const dailyData = days.map(d => ({ date: d.label, jumlah: d.count }));

  // Laporan Terbaru (Tabel Bawah)
  const recentReports = await sql`SELECT * FROM pengaduan ORDER BY tanggal DESC LIMIT 5`;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Beranda Dasbor</h1>
      </div>

      <div className={styles.statsGrid}>
        {/* Card 1: Semua Laporan */}
        <div className={styles.statCard}>
          <div className={styles.statBlob} style={{ backgroundColor: 'rgba(59, 130, 246, 0.4)' }}></div>
          <div className={styles.statContent}>
            <div className={styles.statTitle}>Semua Laporan</div>
            <div className={styles.statValue}>{totalReports}</div>
          </div>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
        </div>

        {/* Card 2: Laporan Hari Ini */}
        <div className={styles.statCard}>
          <div className={styles.statBlob} style={{ backgroundColor: 'rgba(234, 179, 8, 0.4)' }}></div>
          <div className={styles.statContent}>
            <div className={styles.statTitle}>Laporan Hari Ini</div>
            <div className={styles.statValue}>{todayReports}</div>
          </div>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>

        {/* Card 3: Laporan Mingguan */}
        <div className={styles.statCard}>
          <div className={styles.statBlob} style={{ backgroundColor: 'rgba(34, 197, 94, 0.4)' }}></div>
          <div className={styles.statContent}>
            <div className={styles.statTitle}>Laporan Mingguan</div>
            <div className={styles.statValue}>{weekReports}</div>
          </div>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
        </div>

        {/* Card 4: Total Foto Bukti */}
        <div className={styles.statCard}>
          <div className={styles.statBlob} style={{ backgroundColor: 'rgba(168, 85, 247, 0.4)' }}></div>
          <div className={styles.statContent}>
            <div className={styles.statTitle}>Total Foto Bukti</div>
            <div className={styles.statValue}>{photoReports}</div>
          </div>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#9333ea' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
        </div>
      </div>

      <DashboardCharts dailyData={dailyData} categoryData={categoryData as any} />

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>Laporan Terbaru</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nomor Pengaduan</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.length > 0 ? (
              recentReports.map((report: any) => (
                <tr key={report.id}>
                  <td>{report.nomor_pengaduan}</td>
                  <td>{report.nama}</td>
                  <td><span className={styles.badge}>{report.kategori}</span></td>
                  <td>{new Date(report.tanggal).toLocaleDateString("id-ID")}</td>
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
                <td colSpan={6} style={{ textAlign: "center", color: "#64748b" }}>
                  Belum ada laporan yang masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
