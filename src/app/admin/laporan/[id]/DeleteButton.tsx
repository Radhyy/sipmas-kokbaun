"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { deleteReport } from "../../../actions/deleteReport";

export default function DeleteButton({ id, iconOnly = false }: { id: string, iconOnly?: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleConfirm = async () => {
    setIsDeleting(true);
    
    try {
      const res = await deleteReport(id);
      if (res.success) {
        setShowConfirm(false);
        if (pathname.includes(`/laporan/${id}`)) {
          router.push("/admin/laporan");
        } else {
          router.refresh();
        }
      } else {
        alert(res.message || "Gagal menghapus laporan.");
        setIsDeleting(false);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem saat menghapus laporan.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)} 
        disabled={isDeleting}
        title="Hapus Laporan"
        style={iconOnly ? {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.4rem',
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          border: '1px solid #fca5a5',
          borderRadius: '6px',
          cursor: isDeleting ? 'not-allowed' : 'pointer',
          opacity: isDeleting ? 0.7 : 1,
        } : {
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.25rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.95rem',
          cursor: isDeleting ? 'not-allowed' : 'pointer',
          opacity: isDeleting ? 0.7 : 1,
          transition: 'all 0.2s',
        }}
      >
        {isDeleting && !iconOnly ? (
          "Menghapus..."
        ) : (
          <svg width={iconOnly ? "16" : "18"} height={iconOnly ? "16" : "18"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        )}
        {!iconOnly && !isDeleting && " Hapus Laporan"}
      </button>

      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            textAlign: 'center',
            animation: 'slideUp 0.2s ease-out'
          }}>
            <div style={{
              width: '64px', height: '64px',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Hapus Laporan?</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Apakah Anda yakin ingin menghapus laporan ini? Data yang dihapus tidak dapat dikembalikan lagi.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Batal
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isDeleting}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
