"use client";

import { useState, useTransition } from "react";
import { updateStatusAction } from "../../../actions/updateStatus";
import styles from "../admin.module.css";

interface StatusUpdaterProps {
  id: string;
  initialStatus: string;
}

export default function StatusUpdater({ id, initialStatus }: StatusUpdaterProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialStatus || "Terkirim");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    
    startTransition(async () => {
      const res = await updateStatusAction(id, newStatus);
      if (!res.success) {
        alert(res.message);
        setStatus(status); // revert on error
      }
    });
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case "Terkirim": return { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };
      case "Diproses": return { bg: "#fef3c7", text: "#d97706", border: "#fde68a" };
      case "Selesai": return { bg: "#dcfce7", text: "#16a34a", border: "#bbf7d0" };
      default: return { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };
    }
  };

  const currentColors = getStatusColor(status);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <select 
        value={status} 
        onChange={handleChange}
        disabled={isPending}
        style={{
          padding: '0.4rem 2rem 0.4rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          backgroundColor: currentColors.bg,
          color: currentColors.text,
          border: `1px solid ${currentColors.border}`,
          appearance: 'none',
          cursor: isPending ? 'wait' : 'pointer',
          outline: 'none',
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(currentColors.text)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1em'
        }}
      >
        <option value="Terkirim">Terkirim</option>
        <option value="Diproses">Diproses</option>
        <option value="Selesai">Selesai</option>
      </select>
      
      {isPending && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Menyimpan...</span>}
    </div>
  );
}
