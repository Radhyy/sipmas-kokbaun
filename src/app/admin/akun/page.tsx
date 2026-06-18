import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "../admin.module.css";
import AdminAccountClient from "./AdminAccountClient";
import { getAdmins } from "../../actions/adminAccounts";

export const metadata = {
  title: "Pengaturan Akun | SIPMAS KOKBAUN",
};

export default async function AkunAdminPage() {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session?.value) {
    redirect("/login");
  }

  const currentSessionUsername = session.value;

  const res = await getAdmins();
  const admins = res.success && res.data ? res.data as any[] : [];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Pengaturan Akun</h1>
      </div>

      <AdminAccountClient admins={admins} currentSessionUsername={currentSessionUsername} />
    </div>
  );
}
