import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export const metadata = {
  title: "Admin Login | SIPMAS KOKBAUN",
  description: "Login untuk masuk ke dasbor pengaduan masyarakat.",
};

export default function LoginPage() {
  return (
    <main className={styles.loginPage}>
      <LoginForm />
    </main>
  );
}
