"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function getNotificationEmails() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT id, email, created_at FROM notification_emails ORDER BY created_at DESC`;
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error getting notification emails:", error);
    return { success: false, message: error.message };
  }
}

export async function addNotificationEmail(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
      return { success: false, error: "Format email tidak valid" };
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Cek apakah email sudah ada
    const existing = await sql`SELECT * FROM notification_emails WHERE email = ${email}`;
    if (existing.length > 0) {
      return { success: false, error: "Email sudah terdaftar" };
    }

    await sql`INSERT INTO notification_emails (email) VALUES (${email})`;

    revalidatePath("/admin/notifikasi");
    return { success: true, message: "Email berhasil ditambahkan" };
  } catch (error: any) {
    console.error("Add notification email error:", error);
    return { success: false, error: "Terjadi kesalahan pada server saat menambah email." };
  }
}

export async function deleteNotificationEmail(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM notification_emails WHERE id = ${id}`;

    revalidatePath("/admin/notifikasi");
    return { success: true, message: "Email berhasil dihapus." };
  } catch (error: any) {
    console.error("Delete notification email error:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat menghapus email." };
  }
}
