"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../admin.module.css";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [nama, setNama] = useState(searchParams.get("nama") || "");
  const [kategori, setKategori] = useState(searchParams.get("kategori") || "");
  const [lokasi, setLokasi] = useState(searchParams.get("lokasi") || "");
  const [tanggal, setTanggal] = useState(searchParams.get("tanggal") || "");
  
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (nama) params.set("nama", nama);
    if (kategori) params.set("kategori", kategori);
    if (lokasi) params.set("lokasi", lokasi);
    if (tanggal) params.set("tanggal", tanggal);
    
    router.push(`/admin/laporan?${params.toString()}`);
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  const handleReset = () => {
    setNama("");
    setKategori("");
    setLokasi("");
    setTanggal("");
    router.push("/admin/laporan");
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeaderToggle} onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#0f172a' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          Filter Pencarian
        </div>
        <svg 
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <form onSubmit={handleFilter} className={styles.filterForm}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Nama Pelapor</label>
            <input 
              type="text" 
              placeholder="Cari nama..." 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              className={styles.filterInput} 
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Kategori</label>
            <select 
              value={kategori} 
              onChange={(e) => setKategori(e.target.value)} 
              className={styles.filterInput}
            >
              <option value="">Semua Kategori</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Ketentraman dan Ketertiban">Ketentraman & Ketertiban</option>
              <option value="Sosial Kemasyarakatan">Sosial Kemasyarakatan</option>
              <option value="Lingkungan">Lingkungan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Lokasi Kejadian</label>
            <select 
              value={lokasi} 
              onChange={(e) => setLokasi(e.target.value)} 
              className={styles.filterInput}
            >
              <option value="">Semua Desa</option>
              <option value="Desa Niti">Desa Niti</option>
              <option value="Desa Sapnala">Desa Sapnala</option>
              <option value="Desa Koloto">Desa Koloto</option>
              <option value="Desa Lotas">Desa Lotas</option>
              <option value="Desa Benahe">Desa Benahe</option>
              <option value="Desa Obaki">Desa Obaki</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Tanggal Laporan</label>
            <input 
              type="date" 
              value={tanggal} 
              onChange={(e) => setTanggal(e.target.value)} 
              className={styles.filterInput} 
            />
          </div>

          <div className={styles.filterActions}>
            <button type="submit" className={`${styles.filterBtn} ${styles.filterBtnPrimary}`}>
              Terapkan Filter
            </button>
            <button type="button" onClick={handleReset} className={`${styles.filterBtn} ${styles.filterBtnSecondary}`}>
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
