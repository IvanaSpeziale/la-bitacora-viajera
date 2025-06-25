"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./CreateOrEditJournalEntryForm.module.scss";
import { toast } from "react-toastify";
import { JournalEntryDTO } from "../../DTOs/journalEntryDTO";
import { useMyTravelJournal } from "../../hook/useMyTravelJournal";
import { LocationSelector } from "../location-selector/LocationSelector";
import { Location } from "../../entities/location";
import { useRouter, useSearchParams } from "next/navigation";

interface CreateJournalEntryFormProps {
  entry?: JournalEntryDTO;
}

const CreateJournalEntryForm: React.FC<CreateJournalEntryFormProps> = ({
  entry,
}) => {
  const { addEntry, editEntry, fetchEntryById } = useMyTravelJournal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams?.get("id");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JournalEntryDTO>({
    mode: "onChange",
    defaultValues: entry || {},
  });

  const [images, setImages] = useState<File[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [imageInputs, setImageInputs] = useState<number[]>([0]);

  useEffect(() => {
    const loadEntry = async () => {
      if (entryId) {
        const fetchedEntry = await fetchEntryById(entryId);
        if (fetchedEntry) {
          reset({
            ...fetchedEntry,
            date: fetchedEntry.date.split("T")[0],
            imageUrls: [],
          });
          setLocations(fetchedEntry.locations);
          setImages([]);

          console.log("Form reset with:", {
            date: fetchedEntry.date.split("T")[0],
            locations: fetchedEntry.locations,
            images: fetchedEntry.imageUrls,
          });
        }
      }
    };

    loadEntry();
  }, []);

  const handleImgChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const addImageInput = () => {
    setImageInputs((prev) => [...prev, prev.length]);
  };

  const deleteImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newInputs = [...imageInputs];
    newInputs.splice(index, 1);
    setImageInputs(newInputs);
  };

  const handleAllEntries = () => {
    router.push("/journal-dashboard");
  };

  const buildFormData = (data: JournalEntryDTO) => {
    const formData = new FormData();
    formData.append("date", data.date);
    formData.append("description", data.description);
    formData.append("favorite", data.favorite);
    formData.append("leastFavorite", data.leastFavorite || "");
    formData.append("score", String(data.score));
    formData.append("dailyExpenses", String(data.dailyExpenses));
    formData.append("locations", JSON.stringify(locations));
    images.forEach((img) => {
      formData.append("files", img);
    });
    return formData;
  };

  const onSubmit = async (data: JournalEntryDTO) => {
    try {
      const formData = buildFormData(data);

      if (entryId) {
        await editEntry(entryId, formData);
        toast.success("Entrada actualizada con éxito");
        router.push("/journal-dashboard");
      } else {
        await addEntry(formData);
        router.push("/journal-dashboard");
        toast.success("Entrada creada con éxito");
      }

      reset();
      setImages([]);
      setLocations([]);
      setImageInputs([0]);
    } catch (error) {
      console.error("Error submitting entry:", error);
      toast.error("Error al enviar la entrada");
    }
  };

  const isEditing = Boolean(entryId);

  return (
    <div className={styles.container}>
      <h2 className={styles.centeredUnderlined}>
        {isEditing ? "Editar entrada" : "Crear nueva entrada"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <LocationSelector onLocationsChange={setLocations} />

        <input
          type="date"
          placeholder="Fecha"
          className={styles.inputCreateForm}
          max={new Date().toISOString().split("T")[0]}
          {...register("date", { required: "La fecha es obligatoria" })}
        />
        {errors.date && <p className={styles.error}>{errors.date.message}</p>}

        <textarea
          placeholder="Descripción"
          className={styles.textareaForm}
          {...register("description", {
            required: "La descripción es obligatoria",
          })}
        />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}

        <input
          type="text"
          placeholder="Lo que más me gustó"
          className={styles.inputCreateForm}
          {...register("favorite", { required: "Este campo es obligatorio" })}
        />
        {errors.favorite && (
          <p className={styles.error}>{errors.favorite.message}</p>
        )}

        <input
          type="text"
          placeholder="Lo que menos me gustó"
          className={styles.inputCreateForm}
          {...register("leastFavorite")}
        />

        <input
          type="number"
          placeholder="Puntaje (1-5)"
          className={styles.inputCreateForm}
          {...register("score", {
            required: "El puntaje es obligatorio",
            min: { value: 1, message: "Mínimo 1" },
            max: { value: 5, message: "Máximo 5" },
          })}
        />
        {errors.score && <p className={styles.error}>{errors.score.message}</p>}

        <input
          type="number"
          placeholder="Gastos diarios"
          className={styles.inputCreateForm}
          {...register("dailyExpenses", {
            required: "Campo obligatorio",
            min: { value: 0, message: "No puede ser negativo" },
          })}
        />
        {errors.dailyExpenses && (
          <p className={styles.error}>{errors.dailyExpenses.message}</p>
        )}

        <div className={styles.imageContainer}>
          {imageInputs.map((i) => (
            <div key={i} className={styles.imageWrapper}>
              <input type="file" onChange={(e) => handleImgChange(e, i)} />
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => deleteImage(i)}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addImageButton}
            onClick={addImageInput}
          >
            + Agregar otra imagen
          </button>
        </div>
        <div className={styles.submitContainer}>
          <button type="submit" className={styles.buttonForm}>
            {isEditing ? "Editar entrada" : "Crear entrada"}
          </button>
        </div>

        {errors.date && (
          <p className={styles.error}>La fecha es obligatoria.</p>
        )}
        {errors.description && (
          <p className={styles.error}>La descripción es obligatoria.</p>
        )}
        {errors.favorite && (
          <p className={styles.error}>Este campo es obligatorio.</p>
        )}
        {errors.score && (
          <p className={styles.error}>El puntaje debe estar entre 1 y 5.</p>
        )}
        {errors.dailyExpenses && (
          <p className={styles.error}>
            Los gastos diarios no pueden ser negativos.
          </p>
        )}
      </form>

      <button onClick={handleAllEntries} className={styles.buttonForm}>
        Ver todas las entradas
      </button>
    </div>
  );
};

export default CreateJournalEntryForm;
