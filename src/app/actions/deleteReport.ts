"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function deleteReport(id: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM pengaduan WHERE id = ${id}`;

    revalidatePath("/admin");
    revalidatePath("/admin/laporan");
    
    return { success: true, message: "Laporan berhasil dihapus" };
  } catch (error: any) {
    console.error("Error deleting report:", error);
    return { success: false, message: error.message || "Terjadi kesalahan saat menghapus laporan" };
  }
}
