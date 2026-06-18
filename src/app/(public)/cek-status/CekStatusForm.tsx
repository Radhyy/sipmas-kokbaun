"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./status.module.css";

export default function CekStatusForm() {
  const searchParams = useSearchParams();
  const initialNomor = searchParams.get("nomor") || "";
  
  const [nomor, setNomor] = useState(initialNomor);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Stop loading when URL changes (i.e., search completes)
    setIsLoading(false);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomor.trim()) return;
    
    setIsLoading(true);
    router.push(`/cek-status?nomor=${encodeURIComponent(nomor.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="nomor" className={styles.label}>Masukkan Nomor Pengaduan</label>
      <div className={styles.inputGroup}>
        <input 
          type="text" 
          id="nomor"
          value={nomor} 
          onChange={(e) => setNomor(e.target.value)}
          placeholder="Contoh: PENG-12345678-123" 
          className={styles.input}
          required
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
              Mencari...
            </div>
          ) : "Lacak"}
        </button>
      </div>
    </form>
  );
}
