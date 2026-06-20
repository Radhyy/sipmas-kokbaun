"use client";

import { useTransition, useState } from "react";
import { addNotificationEmail, deleteNotificationEmail } from "../../actions/notifications";

type NotificationEmail = {
  id: number;
  email: string;
};

export default function AdminNotificationClient({ emails }: { emails: NotificationEmail[] }) {
  const [isPendingAdd, startTransitionAdd] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    startTransitionAdd(async () => {
      const result = await addNotificationEmail(null, formData);
      if (result.error) {
        setAddError(result.error);
      } else if (result.success) {
        setAddSuccess(result.message || "Berhasil");
        form.reset();
        setTimeout(() => setAddSuccess(null), 3000);
      }
    });
  };

  const handleDelete = async (id: number, email: string) => {
    if (!window.confirm(`Hapus email '${email}' dari daftar penerima notifikasi?`)) return;

    setDeletingId(id);
    const res = await deleteNotificationEmail(id);
    if (!res.success) {
      alert(res.message);
    }
    setDeletingId(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      
      {/* Kolom Kiri: Tabel Daftar Email */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Daftar Email Penerima</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Email di bawah ini akan menerima pesan otomatis setiap kali ada warga yang mengirim laporan baru.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {emails.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontStyle: 'italic', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
              Belum ada email yang didaftarkan.
            </div>
          ) : (
            emails.map((item) => {
              const isDeletingThis = deletingId === item.id;
              
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', wordBreak: 'break-all' }}>{item.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id, item.email)}
                    disabled={isDeletingThis}
                    title="Hapus Email"
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#ef4444',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      cursor: isDeletingThis ? 'not-allowed' : 'pointer',
                      opacity: isDeletingThis ? 0.5 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Kolom Kanan: Form Tambah Email */}
      <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Tambah Email Tujuan</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Masukkan alamat email aktif. Anda bisa mendaftarkan email kepala desa, staf, atau email pribadi.
        </p>

        {addError && (
          <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fecaca', fontSize: '0.9rem' }}>
            {addError}
          </div>
        )}

        {addSuccess && (
          <div style={{ backgroundColor: '#f0fdf4', color: '#15803d', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #bbf7d0', fontSize: '0.9rem' }}>
            {addSuccess}
          </div>
        )}

        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Alamat Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              placeholder="contoh: kades@gmail.com"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isPendingAdd}
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              fontWeight: 600, 
              border: 'none',
              cursor: isPendingAdd ? 'not-allowed' : 'pointer',
              opacity: isPendingAdd ? 0.7 : 1,
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {isPendingAdd ? "Menyimpan..." : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                Tambah Email
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
