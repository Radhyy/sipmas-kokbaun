import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "../admin.module.css";
import AdminNotificationClient from "./AdminNotificationClient";
import { getNotificationEmails } from "../../actions/notifications";

export const metadata = {
  title: "Notifikasi Email | SIPMAS KOKBAUN",
};

export default async function NotifikasiEmailPage() {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session?.value) {
    redirect("/login");
  }

  const res = await getNotificationEmails();
  const emails = res.success && res.data ? res.data as any[] : [];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Notifikasi Email</h1>
      </div>

      <AdminNotificationClient emails={emails} />
    </div>
  );
}
