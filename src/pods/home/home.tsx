"use client";
import PicsGallery from "@/pods/home/last-journal-inputs/picsGallery";
import Header from "@/core/ui/header/header";
import Footer from "@/core/ui/footer/footer";
import styles from "../../app/page.module.css";
import CountdownTimer from "@/pods/home/next-destination-countdown/components/countdownTImer";
import dynamic from "next/dynamic";
import { useMyTravelJournal } from "@/pods/my-travel-journal/hook/useMyTravelJournal";
const MapWithPins = dynamic(() => import("@/pods/home/map/mapWithPins"), {
  ssr: false,
});

export default function Home() {
  const { entries } = useMyTravelJournal();

  const locations = entries
    .filter((entry) => {
      const visitDate = new Date(entry.date);
      return visitDate < new Date();
    })
    .flatMap((entry) =>
      entry.locations.map((location) => ({
        name: location.name,
        lat: location.lat,
        lng: location.lon ?? 0,
      }))
    );

  const images = entries.flatMap((entry) => entry.imageUrls);

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <section>
            <CountdownTimer />
          </section>
          <section>
            <MapWithPins locations={locations} />
          </section>
          {images.length === 0 ? (
            <p className={styles.noPhotosMessage}>Oops! Aún no hay fotos!</p>
          ) : (
            <section>
              <h2 className={styles.centeredUnderlined}>Mis fotos</h2>
              <PicsGallery images={images} />
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
