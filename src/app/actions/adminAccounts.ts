"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function getAdmins() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // Hanya ambil username dan id, JANGAN pernah ambil password_hash untuk keamanan
    const result = await sql`SELECT id, username FROM admin_users ORDER BY username ASC`;
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error getting admins:", error);
    return { success: false, message: error.message };
  }
}

export async function addAdmin(prevState: any, formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { success: false, error: "Username dan Password wajib diisi" };
    }
    
    if (username.length < 4) {
      return { success: false, error: "Username minimal 4 karakter" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter" };
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Cek apakah username sudah ada
    const existing = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
    if (existing.length > 0) {
      return { success: false, error: "Username sudah digunakan, silakan pilih yang lain." };
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await sql`INSERT INTO admin_users (username, password_hash) VALUES (${username}, ${hash})`;

    revalidatePath("/admin/akun");
    return { success: true, message: "Akun admin berhasil ditambahkan" };
  } catch (error: any) {
    console.error("Add admin error:", error);
    return { success: false, error: "Terjadi kesalahan pada server saat menambah admin." };
  }
}

export async function deleteAdmin(idToDelete: number, usernameToDelete: string) {
  try {
    const cookieStore = await cookies();
    const currentUsername = cookieStore.get("admin_session")?.value;

    if (!currentUsername) {
      return { success: false, message: "Sesi tidak valid." };
    }

    if (currentUsername === usernameToDelete) {
      return { success: false, message: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif." };
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Proteksi tambahan: Pastikan masih ada minimal 1 admin setelah penghapusan
    const totalAdminsResult = await sql`SELECT COUNT(*) as count FROM admin_users`;
    const totalAdmins = parseInt(totalAdminsResult[0].count, 10);
    
    if (totalAdmins <= 1) {
      return { success: false, message: "Tidak dapat menghapus admin satu-satunya di sistem." };
    }

    await sql`DELETE FROM admin_users WHERE id = ${idToDelete}`;

    revalidatePath("/admin/akun");
    return { success: true, message: "Akun admin berhasil dihapus." };
  } catch (error: any) {
    console.error("Delete admin error:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat menghapus admin." };
  }
}
