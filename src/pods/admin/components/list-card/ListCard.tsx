import React from "react";
import Link from "next/link";
import styles from "../list-card/ListCard.module.scss";

interface ListCardProps {
  title: string;
  seeMoreLink: string;
  children?: React.ReactNode;
}

const ListCard: React.FC<ListCardProps> = ({
  title,
  seeMoreLink,
  children,
}) => {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <div className={styles.childrenGrid}>{children}</div>
      <Link href={seeMoreLink} className={styles.seeMore}>
        Ver más
      </Link>
    </div>
  );
};

export default ListCard;
