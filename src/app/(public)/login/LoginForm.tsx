"use client";

import { useTransition, useState } from "react";
import { loginAction } from "../../actions/auth";
import styles from "./login.module.css";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.loginHeader}>
        <Image 
          src="/LOGO-TIMOR-TENGAH-SELATAN.png" 
          alt="Logo" 
          width={60} 
          height={60} 
        />
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sistem Pengaduan Masyarakat Kokbaun</p>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            placeholder="Masukkan username" 
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            placeholder="Masukkan password" 
            className={styles.input}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isPending}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isPending ? "Memeriksa..." : "Masuk ke Dasbor"}
        </button>
      </form>

      <div className={styles.backLink}>
        <Link href="/">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
