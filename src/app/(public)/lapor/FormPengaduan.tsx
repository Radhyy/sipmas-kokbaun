"use client";

import { useState, useTransition } from "react";
import { submitReport } from "../../actions/submitReport";
import styles from "./lapor.module.css";
import Link from "next/link";

export default function FormPengaduan() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; message?: string; nomor_pengaduan?: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formElement = e.target as HTMLFormElement;
    
    startTransition(async () => {
      const res = await submitReport(null, formData);
      setResult(res);
      if (res.success && res.nomor_pengaduan) {
        setIsModalOpen(true);
        formElement.reset();
      }
    });
  };

  const copyToClipboard = () => {
    if (result?.nomor_pengaduan) {
      navigator.clipboard.writeText(result.nomor_pengaduan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResult(null);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Form Laporan Kerusakan / Pengaduan</h2>
      <p className={styles.formSubtitle}>Silakan isi form di bawah ini dengan data yang valid dan dapat dipertanggungjawabkan.</p>

      {result && !isModalOpen && !result.success && (
        <div className={styles.alertError}>
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Nama Pelapor *</label>
          <input type="text" name="nama" required placeholder="Nama Lengkap sesuai KTP" />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>NIK *</label>
            <input type="text" name="nik" required placeholder="Nomor Induk Kependudukan" />
          </div>
          <div className={styles.inputGroup}>
            <label>No HP / WhatsApp *</label>
            <input type="text" name="hp" required placeholder="Misal: 08123456789" />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Alamat *</label>
          <input type="text" name="alamat" required placeholder="RT/RW, Dusun" />
        </div>

        <div className={styles.inputGroup}>
          <label>Kategori Pengaduan *</label>
          <select name="kategori" required>
            <option value="">-- Pilih Kategori --</option>
            <option value="Infrastruktur">Infrastruktur (jalan, jembatan, drainase, fasilitas umum)</option>
            <option value="Ketentraman dan Ketertiban">Ketentraman dan Ketertiban</option>
            <option value="Sosial Kemasyarakatan">Sosial Kemasyarakatan</option>
            <option value="Lingkungan">Lingkungan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Lokasi Kejadian *</label>
          <div className={styles.radioGrid}>
            <label><input type="radio" name="lokasi" value="Desa Niti" required /> Desa Niti</label>
            <label><input type="radio" name="lokasi" value="Desa Sapnala" /> Desa Sapnala</label>
            <label><input type="radio" name="lokasi" value="Desa Koloto" /> Desa Koloto</label>
            <label><input type="radio" name="lokasi" value="Desa Lotas" /> Desa Lotas</label>
            <label><input type="radio" name="lokasi" value="Desa Benahe" /> Desa Benahe</label>
            <label><input type="radio" name="lokasi" value="Desa Obaki" /> Desa Obaki</label>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Uraian Pengaduan *</label>
          <textarea name="uraian" rows={5} required placeholder="Jelaskan detail pengaduan atau kerusakan yang terjadi..."></textarea>
        </div>

        <div className={styles.inputGroup}>
          <label>Bukti Dukung (Foto) *</label>
          <p className={styles.helpText}>Unggah foto kerusakan atau kejadian (Maks 5MB. Hanya file gambar).</p>
          <input type="file" name="foto" accept="image/*" required className={styles.fileInput} />
        </div>

        <div className={styles.checkboxGroup}>
          <label>
            <input type="checkbox" name="pernyataan" required />
            <span>Saya menyatakan bahwa laporan ini benar dan dapat dipertanggungjawabkan.</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isPending} style={{ width: "100%", marginTop: "1rem" }}>
          {isPending ? "Mengirim Laporan..." : "Kirim Laporan"}
        </button>
      </form>

      {/* Success Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 className={styles.modalTitle}>Laporan Berhasil Terkirim!</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem' }}>Terima kasih telah berpartisipasi untuk memajukan Kecamatan Kokbaun.</p>
            
            <div className={styles.modalWarning}>
              <strong>PENTING:</strong> Harap simpan Nomor Pengaduan di bawah ini. Anda akan membutuhkannya untuk mengecek status tindak lanjut laporan Anda nantinya.
            </div>

            <div className={styles.nomorBox}>
              <div className={styles.nomorText}>{result?.nomor_pengaduan}</div>
              <button type="button" onClick={copyToClipboard} className={styles.copyButton}>
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Tersalin!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Salin Kode
                  </>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={closeModal} className={styles.closeButton}>
                Tutup
              </button>
              <Link href="/cek-status" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', color: '#0f172a', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                Cek Status
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
