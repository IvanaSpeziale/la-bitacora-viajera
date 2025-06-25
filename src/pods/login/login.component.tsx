"use client";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "./login.module.scss";
import { AuthContext } from "@/core/pods/auth/auth.provider";

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext no está disponible.");
  }

  const { login, user } = authContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const router = useRouter();

  // Redirección reactiva tras login exitoso y usuario actualizado
  useEffect(() => {
    console.log("[LOGIN DEBUG] isLoginSuccess:", isLoginSuccess, "user:", user);
    if (isLoginSuccess && user) {
      if (user && user.is_admin) {
        console.log("[LOGIN DEBUG] Redirigiendo a /admin");
        router.push("/admin");
      } else {
        console.log("[LOGIN DEBUG] Redirigiendo a /");
        router.push("/");
      }
    }
  }, [isLoginSuccess, user, router]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const validation = await login(email, password);

      if (validation.email || validation.password) {
        setError(validation.email || validation.password);
        setEmail("");
        setPassword("");
        setIsLoginSuccess(false);
        return;
      }

      toast.success("Inicio de sesión exitoso");
      setIsLoginSuccess(true);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error al conectar con el servidor");
      setIsLoginSuccess(false);
    }
  };

  const handleSignupRedirect = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    toast.info("Redirigiendo a la página de registro");
    router.push("/signup");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleLogin}>
          <label htmlFor="email" className={styles.label}>
            Correo electrónico
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className={styles.input}
          />
          <label htmlFor="password" className={styles.label}>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Completa con tu contraseña"
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Login
          </button>
          <a href="#" onClick={handleSignupRedirect} className={styles.link}>
            Registrarse
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
