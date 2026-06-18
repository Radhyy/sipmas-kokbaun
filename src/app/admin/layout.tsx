import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Dasbor Admin | SIPMAS KOKBAUN",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
