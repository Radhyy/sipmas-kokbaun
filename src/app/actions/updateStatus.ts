"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateStatusAction(id: string, newStatus: string) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (!session?.value) {
      throw new Error("Unauthorized");
    }

    const sql = neon(process.env.DATABASE_URL!);
    await sql`UPDATE pengaduan SET status = ${newStatus} WHERE id = ${id}`;

    // Revalidate multiple paths where status might be shown
    revalidatePath("/admin");
    revalidatePath("/admin/laporan");
    revalidatePath(`/admin/laporan/${id}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error updating status:", error);
    return { success: false, message: error.message || "Terjadi kesalahan" };
  }
}
