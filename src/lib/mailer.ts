import nodemailer from "nodemailer";

// Konfigurasi Transport Nodemailer
// Menggunakan akun Gmail yang di-set di .env.local
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendNotificationEmails(emails: string[], reportData: any) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("Peringatan: SMTP_EMAIL atau SMTP_PASSWORD belum diatur di .env.local. Notifikasi email dibatalkan.");
    return false;
  }

  if (!emails || emails.length === 0) {
    return false; // Tidak ada penerima
  }

  const { nomorPengaduan, nama, kategori, lokasi, uraian, tanggal } = reportData;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <div style="background-color: #0f172a; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 24px;">Laporan Baru Masuk!</h2>
        <p style="margin: 5px 0 0; color: #cbd5e1; font-size: 14px;">Sistem Pengaduan Masyarakat Kokbaun</p>
      </div>
      <div style="padding: 30px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <span style="background-color: #fef2f2; color: #ef4444; padding: 8px 16px; border-radius: 9999px; font-weight: bold; font-size: 14px; border: 1px solid #fca5a5;">
            ${nomorPengaduan}
          </span>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 120px;">Tanggal</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${tanggal}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Nama Pelapor</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${nama}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Kategori</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${kategori}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Lokasi</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${lokasi}</td>
          </tr>
        </table>

        <div style="margin-top: 25px;">
          <p style="color: #64748b; margin-bottom: 8px;">Uraian Aduan:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; line-height: 1.6;">
            ${uraian}
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/laporan" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Buka Dasbor Admin
          </a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; color: #94a3b8; font-size: 12px;">
        Pesan ini dikirim secara otomatis oleh Sistem SIPMAS. Jangan membalas email ini.
      </div>
    </div>
  `;

  try {
    // Kirim email ke semua daftar BCC agar tidak saling melihat alamat email satu sama lain
    await transporter.sendMail({
      from: `"SIPMAS KOKBAUN" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL, // Kirim ke diri sendiri sebagai primary
      bcc: emails, // Tembusan ke semua admin yang terdaftar
      subject: `Laporan Baru [${nomorPengaduan}]: ${kategori}`,
      html: htmlContent,
    });
    
    console.log(`Berhasil mengirim notifikasi email ke ${emails.length} penerima.`);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email notifikasi:", error);
    return false;
  }
}
