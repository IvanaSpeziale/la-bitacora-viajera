"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./picsGallery.module.scss";

interface PicsGalleryProps {
  images: string[];
}

const PicsGallery: React.FC<PicsGalleryProps> = ({ images }) => {
  const [visibleImages, setVisibleImages] = useState(15);

  const loadMoreImages = () => {
    setVisibleImages((prev) => Math.min(prev + 15, images.length));
  };

  const loadLessImages = () => {
    setVisibleImages((prev) => Math.max(prev - 15, 15));
  };

  return (
    <div>
      <div className={styles.masonryGrid}>
        {images.slice(0, visibleImages).map((image, index) => (
          <div key={index} className={styles.masonryGridColumn}>
            <Image
              src={image}
              alt={`User image ${index}`}
              className={styles.image}
              width={300}
              height={200}
            />
          </div>
        ))}
      </div>
      <div className={styles.buttonsContainer}>
        {visibleImages < images.length && (
          <button onClick={loadMoreImages} className={styles.loadMore}>
            Cargar más
          </button>
        )}
        {visibleImages > 15 && (
          <button onClick={loadLessImages} className={styles.loadLess}>
            Cargar menos
          </button>
        )}
      </div>
    </div>
  );
};

export default PicsGallery;
