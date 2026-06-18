"use client";

import { useTransition, useState } from "react";
import { addAdmin, deleteAdmin } from "../../actions/adminAccounts";

type AdminUser = {
  id: number;
  username: string;
};

export default function AdminAccountClient({ admins, currentSessionUsername }: { admins: AdminUser[], currentSessionUsername: string }) {
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
      const result = await addAdmin(null, formData);
      if (result.error) {
        setAddError(result.error);
      } else if (result.success) {
        setAddSuccess(result.message || "Berhasil");
        form.reset();
        // Sembunyikan notifikasi sukses setelah 3 detik
        setTimeout(() => setAddSuccess(null), 3000);
      }
    });
  };

  const handleDelete = async (id: number, username: string) => {
    // Validasi double check di client
    if (username === currentSessionUsername) {
      alert("Anda tidak bisa menghapus akun yang sedang Anda gunakan.");
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus admin '${username}'?`)) return;

    setDeletingId(id);
    const res = await deleteAdmin(id, username);
    if (!res.success) {
      alert(res.message);
    }
    setDeletingId(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      
      {/* Kolom Kiri: Tabel Daftar Admin */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Daftar Admin Terdaftar</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {admins.map((admin) => {
            const isCurrentUser = admin.username === currentSessionUsername;
            const isDeletingThis = deletingId === admin.id;
            
            return (
              <div key={admin.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: isCurrentUser ? '#f8fafc' : 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: isCurrentUser ? '#0f172a' : '#f1f5f9', color: isCurrentUser ? 'white' : '#64748b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
                    {admin.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                      {admin.username}
                      {isCurrentUser && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '9999px', fontWeight: 600, whiteSpace: 'nowrap' }}>Anda</span>}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Akses Penuh</div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(admin.id, admin.username)}
                  disabled={isCurrentUser || isDeletingThis}
                  title={isCurrentUser ? "Tidak bisa menghapus akun sendiri" : "Hapus Admin"}
                  style={{
                    backgroundColor: isCurrentUser ? '#f1f5f9' : '#fef2f2',
                    color: isCurrentUser ? '#94a3b8' : '#ef4444',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    cursor: isCurrentUser || isDeletingThis ? 'not-allowed' : 'pointer',
                    opacity: isDeletingThis ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Kolom Kanan: Form Tambah Admin */}
      <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Tambah Admin Baru</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Akun baru yang ditambahkan akan memiliki akses penuh yang sama dengan Anda untuk mengelola seluruh data pengaduan.
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
            <label htmlFor="username" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              required 
              placeholder="Minimal 4 karakter"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Kata Sandi (Password)</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              placeholder="Minimal 6 karakter"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isPendingAdd}
            style={{ 
              backgroundColor: '#0f172a', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              fontWeight: 600, 
              border: 'none',
              cursor: isPendingAdd ? 'not-allowed' : 'pointer',
              opacity: isPendingAdd ? 0.7 : 1,
              marginTop: '0.5rem'
            }}
          >
            {isPendingAdd ? "Menambahkan..." : "Tambah Akun"}
          </button>
        </form>
      </div>

    </div>
  );
}
