"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function submitReport(prevState: any, formData: FormData) {
  try {
    const nama = formData.get("nama") as string;
    const nik = formData.get("nik") as string;
    const hp = formData.get("hp") as string;
    const alamat = formData.get("alamat") as string;
    const kategori = formData.get("kategori") as string;
    const lokasi = formData.get("lokasi") as string;
    const uraian = formData.get("uraian") as string;
    const foto = formData.get("foto") as File | null;
    
    // Generate nomor pengaduan
    const nomorPengaduan = `PENG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let buktiUrl = null;

    // Upload to Imgbb if foto exists
    if (foto && foto.size > 0) {
      const imgbbApiKey = process.env.IMGBB_API_KEY;
      if (!imgbbApiKey) throw new Error("IMGBB API Key not configured");

      const imgFormData = new FormData();
      imgFormData.append("image", foto);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: imgFormData,
      });

      const data = await res.json();
      if (data.success) {
        buktiUrl = data.data.url;
      } else {
        throw new Error("Failed to upload image to Imgbb");
      }
    }

    // Save to Database
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO pengaduan (
        nomor_pengaduan, nama, nik, hp, alamat, kategori, lokasi, uraian, bukti_url, pernyataan
      ) VALUES (
        ${nomorPengaduan}, ${nama}, ${nik}, ${hp}, ${alamat}, ${kategori}, ${lokasi}, ${uraian}, ${buktiUrl}, true
      )
    `;

    // Ambil daftar email notifikasi
    try {
      const emailResult = await sql`SELECT email FROM notification_emails`;
      const emailList = emailResult.map(row => row.email);
      
      if (emailList.length > 0) {
        // Import mailer secara dinamis agar tidak memperlambat form
        const { sendNotificationEmails } = await import("../../lib/mailer");
        
        // Kirim asinkron tanpa await agar tidak nge-block form submit pengguna
        sendNotificationEmails(emailList, {
          nomorPengaduan,
          nama,
          kategori,
          lokasi,
          uraian,
          tanggal: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
        }).catch(err => console.error("Async email error:", err));
      }
    } catch (emailErr) {
      console.error("Gagal mengambil daftar email notifikasi:", emailErr);
    }

    revalidatePath("/lapor");
    return { success: true, message: `Laporan berhasil dikirim!`, nomor_pengaduan: nomorPengaduan };

  } catch (error: any) {
    console.error("Error submitting report:", error);
    return { success: false, message: error.message || "Terjadi kesalahan saat mengirim laporan" };
  }
}
