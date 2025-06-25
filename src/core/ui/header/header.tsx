"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./header.module.scss";
import { useAuth } from "@/core/pods/auth/hook/useAuth";

const Header: React.FC = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`${styles.header} ${isHidden ? styles.hidden : ""}`}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/images/logo.png" alt="Logo" />
        </Link>
      </div>
      <nav className={styles.nav}>
        {!user?.is_admin && (
          <Link href="/journal-dashboard" className={styles.navLink}>
            Mis bitácoras
          </Link>
        )}
      </nav>
      <div
        className={styles.userMenu}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <button
          className={styles.userIcon}
          onClick={() => setMenuOpen((open) => !open)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          tabIndex={0}
        >
          <img src="/images/user-icon.png" alt="User Icon" />
        </button>
        {menuOpen && (
          <div
            className={styles.menuDropdown}
            tabIndex={0}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
            onFocus={() => setMenuOpen(true)}
            onBlur={() => setMenuOpen(false)}
          >
            <Link href="/edit-user">Editar mis datos</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
