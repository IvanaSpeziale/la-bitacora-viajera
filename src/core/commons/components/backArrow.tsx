"use client";
import { useRouter } from "next/navigation";
import styles from "./BackArrow.module.scss";

const BackArrow: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navega a la página anterior
  };

  return (
    <div className={styles.backArrow} onClick={handleBack}>
      <span className={styles.arrow}>&larr;</span> Atrás
    </div>
  );
};

export default BackArrow;
