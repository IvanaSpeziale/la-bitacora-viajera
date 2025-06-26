"use client";
import styles from "./journalDashboard.module.scss";
import { useState, useEffect } from "react";
import { useMyTravelJournal } from "../../hook/useMyTravelJournal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { JournalEntry } from "../../entities/journalEntry";

export const JournalDashboard = () => {
  const { fetchMyEntries, removeEntry } = useMyTravelJournal();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const fetchedEntries = await fetchMyEntries();
        if (fetchedEntries) {
          const sorted = [...fetchedEntries].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setEntries(sorted);
        } else {
          setEntries([]);
        }
      } catch (error) {
        console.error("Error al cargar las entradas:", error);
      }
    };

    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEntryCreationRedirect = () => {
    router.push("/create-journal-entry");
  };

  const handleHomeRedirect = () => {
    router.push("/");
  };

  const handleEditRedirect = () => {
    if (selectedEntryId) {
      router.push(`/create-journal-entry?id=${selectedEntryId}`);
    }
  };

  const handleDelete = async () => {
    if (selectedEntryId) {
      try {
        await removeEntry(selectedEntryId);
        toast.success("Entrada eliminada con éxito");
        setEntries(entries.filter((entry) => entry.id !== selectedEntryId));
        setSelectedEntryId(null);
      } catch (error) {
        toast.error("Error al eliminar la entrada");
        console.error("Error deleting entry:", error);
      }
    } else {
      toast.error("No se puede eliminar una entrada no seleccionada");
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (!searchTerm.trim()) return true;
    if (!Array.isArray(entry.locations) || entry.locations.length === 0)
      return false;
    return entry.locations.some(
      (loc: any) =>
        typeof loc.name === "string" &&
        loc.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.nav}>
          <button
            onClick={handleEntryCreationRedirect}
            className={styles.navItem}
          >
            Crear una entrada
          </button>
          <button onClick={handleHomeRedirect} className={styles.navItem}>
            Página principal
          </button>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <button className={styles.addBtn}>+</button>
          <input
            className={styles.search}
            type="text"
            placeholder="Buscar por lugar"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              console.log("Buscando:", e.target.value);
            }}
          />
        </header>

        <div className={styles.body}>
          <div className={styles.entryList}>
            {filteredEntries.map((entry) => (
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
              <button onClick={handleEditRedirect}>
                <b>Editar</b>
              </button>
              <button>
                <i>I</i>
              </button>
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

                  {/* Limpio logs de debug */}
                  <pre
                    style={{ fontSize: 10, background: "#eee", padding: "2px" }}
                  >
                    {/* {JSON.stringify(entry, null, 2)} */}
                  </pre>
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
