"use client";
import { useRouter } from "next/navigation";
import styles from "./backArrow.module.scss";

const BackArrow: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.backArrow} onClick={handleBack}>
      <span className={styles.arrow}>&larr;</span> Atrás
    </div>
  );
};

export default BackArrow;
