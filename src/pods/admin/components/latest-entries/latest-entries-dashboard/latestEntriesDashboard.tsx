"use client";
import styles from "./latestEntriesDashboard.module.scss";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMyTravelJournal } from "@/pods/my-travel-journal/hook/useMyTravelJournal";
import Image from "next/image";

export const LatestEntriesDashboard = () => {
  const { fetchEntries, removeEntry } = useMyTravelJournal();
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const fetchedEntries = await fetchEntries();
        if (fetchedEntries) {
          const sorted = [...fetchedEntries].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setEntries(sorted);
        } else {
          setEntries([]);
          console.info("No hay entradas disponibles.");
        }
      } catch (error) {
        console.error("Error al cargar las entradas:", error);
      }
    };

    loadEntries();
  }, [fetchEntries]);

  const handleHomeRedirect = () => {
    router.push("/admin");
  };

  const handleDelete = async () => {
    if (selectedEntryId) {
      try {
        await removeEntry(selectedEntryId);
        toast.success("Entrada eliminada con éxito");
        setEntries(entries.filter((entry) => entry.id !== selectedEntryId));
        setSelectedEntryId(null);
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast.error("Error al eliminar la entrada");
      }
    } else {
      toast.error("No se puede eliminar una entrada no seleccionada");
    }
  };

  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.nav}>
          <button onClick={handleHomeRedirect} className={styles.navItem}>
            Página principal
          </button>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <input className={styles.search} type="text" placeholder="Buscar" />
        </header>

        <div className={styles.body}>
          <div className={styles.entryList}>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`${styles.entry} ${
                  selectedEntryId === entry.id ? styles.active : ""
                }`}
                onClick={() => setSelectedEntryId(entry.id)}
              >
                <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                <p>{entry.description.substring(0, 100)}...</p>
              </div>
            ))}
          </div>

          <div className={styles.editor}>
            <div className={styles.toolbar}>
              <button onClick={handleDelete}>
                <u>Eliminar</u>
              </button>
            </div>

            <div className={styles.textArea}>
              {selectedEntry ? (
                <>
                  <h2>{new Date(selectedEntry.date).toLocaleDateString()}</h2>
                  <p>{selectedEntry.description}</p>

                  <h3>Lo que más me gustó</h3>
                  <p>{selectedEntry.favorite}</p>

                  <h3>Lo que menos me gustó</h3>
                  <p>{selectedEntry.leastFavorite}</p>

                  <h3>Gastos diarios</h3>
                  <p>${selectedEntry.dailyExpenses}</p>

                  <h3>Fotos</h3>
                  <div className={styles.images}>
                    {selectedEntry.imageUrls?.length ? (
                      selectedEntry.imageUrls.map(
                        (image: string, index: number) => (
                          <Image
                            key={index}
                            src={image}
                            alt={`Image ${index}`}
                            width={300}
                            height={200}
                          />
                        )
                      )
                    ) : (
                      <p>No hay imágenes disponibles.</p>
                    )}
                  </div>
                </>
              ) : (
                <p>Seleccioná una entrada para ver los detalles.</p>
              )}
            </div>

            <footer className={styles.footer}>
              {selectedEntry && (
                <>
                  <span>
                    📄 {selectedEntry.description.split(" ").length} palabras
                  </span>
                  <span>
                    📍{" "}
                    {selectedEntry.locations
                      .map((loc: { name: string }) => loc.name)
                      .join(", ")}
                  </span>
                  <button className={styles.tag}>
                    Score: {selectedEntry.score}
                  </button>
                </>
              )}
            </footer>
          </div>
        </div>
      </section>
    </div>
  );
};
