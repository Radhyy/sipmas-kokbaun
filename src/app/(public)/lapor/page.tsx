import FormPengaduan from "./FormPengaduan";

export const metadata = {
  title: "Buat Laporan | SIPMAS KOKBAUN",
  description: "Kirim pengaduan, laporan kerusakan, atau aspirasi Anda di Desa Kokbaun.",
};

export default function LaporPage() {
  return (
    <main style={{ paddingTop: "8rem", paddingBottom: "4rem", minHeight: "100vh", backgroundColor: "var(--background)" }}>
      <div className="container">
        <FormPengaduan />
      </div>
    </main>
  );
}
