"use client";
import { useState } from "react";
import styles from "./picsGallery.module.scss";

interface PicsGalleryProps {
  images: string[];
}

const PicsGallery: React.FC<PicsGalleryProps> = ({ images }) => {
  const [visibleImages, setVisibleImages] = useState(15);

  const loadMoreImages = () => {
    setVisibleImages((prev) => Math.min(prev + 15, images.length)); // Asegurarse de no exceder el número total de imágenes
  };

  const loadLessImages = () => {
    setVisibleImages((prev) => Math.max(prev - 15, 15)); // Asegurarse de no mostrar menos de 15 imágenes
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div>
      <div className={styles.masonryGrid}>
        {images.slice(0, visibleImages).map((image, index) => (
          <div key={index} className={styles.masonryGridColumn}>
            <img
              src={image}
              alt={`User image ${index}`}
              className={styles.image}
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
