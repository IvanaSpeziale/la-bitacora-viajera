"use client";
import React, { useEffect, useState } from "react";
import styles from "../latest-users/LatestUsersListCard.module.scss";
import { useMyTravelJournal } from "@/pods/my-travel-journal/hook/useMyTravelJournal";
import { JournalEntry } from "@/pods/my-travel-journal/entities/journalEntry";
import Image from "next/image";

export const LatestEntriesListCard: React.FC = () => {
  const { fetchEntries } = useMyTravelJournal();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    fetchEntries().then((data) => {
      if (data) setEntries(data);
    });
  }, [fetchEntries]);

  return (
    <div className={styles.gridContainer}>
      {entries.slice(0, 6).map((entry) => (
        <div className={styles.card} key={entry.id}>
          <div className={styles.infoSection}>
            <div className={styles.name}>
              {entry.description?.slice(0, 40) || "Sin descripción"}
            </div>
            <div className={styles.email}>
              Fecha:{" "}
              {new Date(entry.date).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className={styles.country}>
              {entry.locations && entry.locations.length > 0
                ? `Lugar: ${entry.locations[0].name}`
                : "Sin lugar"}
            </div>
            {entry.imageUrls && entry.imageUrls.length > 0 && (
              <Image
                src={entry.imageUrls[0]}
                alt={entry.description?.slice(0, 20) || "Imagen entrada"}
                className={styles.entryImage}
                width={300}
                height={200}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestEntriesListCard;
