"use client";

import styles from "./footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Mi Bitácora Viajera</p>
    </footer>
  );
};

export default Footer;
