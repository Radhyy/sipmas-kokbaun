"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { error: "Username dan Password wajib diisi" };
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Cari user di database
    const users = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
    
    if (users.length === 0) {
      return { error: "Username atau Password salah" };
    }

    const user = users[0];

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return { error: "Username atau Password salah" };
    }

    // Set session cookie (HTTP-only)
    // In a real production app you'd encrypt a JWT here. For this simple app we store the username.
    const cookieStore = await cookies();
    cookieStore.set("admin_session", user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

  } catch (error: any) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan pada server. Silakan coba lagi." };
  }

  // Redirect happens outside the try/catch block for Next.js
  redirect("/admin");
}
