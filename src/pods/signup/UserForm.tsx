"use client";
import { useForm } from "react-hook-form";
import styles from "./signup.module.scss";
import { useMemo, useEffect } from "react";
import { useAuth } from "@/core/pods/auth/hook/useAuth";
import BackArrow from "@/core/commons/components/backArrow";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UserFormProps {
  mode: "register" | "edit";
  initialValues?: {
    name: string;
    surname: string;
    country: string;
    email: string;
  };
  onSubmit?: (data: any) => Promise<void>;
  loading?: boolean;
}

type UserFormFields = {
  name: string;
  surname: string;
  country: string;
  email: string;
  password?: string;
  confirmPassword?: string;
};

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  initialValues,
  onSubmit,
  loading = false,
}) => {
  const { user, editUser } = useAuth();
  const router = useRouter();

  const isEdit = mode === "edit";
  const effectiveInitialValues = useMemo(
    () =>
      isEdit && !initialValues && user
        ? {
            name: user.name,
            surname: user.surname,
            country: user.country,
            email: user.email,
          }
        : initialValues,
    [isEdit, initialValues, user]
  );

  const effectiveOnSubmit =
    isEdit && !onSubmit && user
      ? async (data: any) => {
          await editUser({
            id: user.id,
            name: data.name,
            surname: data.surname,
            email: user.email,
            country: data.country,
          });
          if (user.is_admin) {
            toast.success("Usuario actualizado correctamente");
            router.push("/admin");
          } else {
            toast.success("Usuario actualizado correctamente");
            router.push("/");
          }
        }
      : onSubmit;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<UserFormFields>({
    mode: "onChange",
    defaultValues: effectiveInitialValues || {},
  });

  useEffect(() => {
    if (effectiveInitialValues) {
      Object.entries(effectiveInitialValues).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
  }, [effectiveInitialValues, setValue]);

  if (isEdit && !user) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {mode === "register" && <BackArrow />}
        <h2 className="text-center mb-4">
          {mode === "register" ? "Registro" : "Editar mis datos"}
        </h2>
        <form onSubmit={handleSubmit(effectiveOnSubmit!)}>
          <input
            type="text"
            placeholder="Nombre"
            className={styles.input}
            {...register("name", {
              required: "El nombre es obligatorio",
              maxLength: {
                value: 50,
                message: "El nombre no puede exceder los 50 caracteres",
              },
            })}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}

          <input
            type="text"
            placeholder="Apellido"
            className={styles.input}
            {...register("surname", {
              required: "El apellido es obligatorio",
              maxLength: {
                value: 50,
                message: "El apellido no puede exceder los 50 caracteres",
              },
            })}
          />
          {errors.surname && (
            <p className={styles.error}>{errors.surname.message}</p>
          )}

          <input
            type="text"
            placeholder="País"
            className={styles.input}
            {...register("country", {
              required: "El país es obligatorio",
              maxLength: {
                value: 50,
                message: "El país no puede exceder los 50 caracteres",
              },
            })}
          />
          {errors.country && (
            <p className={styles.error}>{errors.country.message}</p>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            className={styles.input}
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/,
                message: "El email no es válido",
              },
            })}
            disabled={mode === "edit"}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}

          {mode === "register" && (
            <>
              <input
                type="password"
                placeholder="Contraseña"
                className={styles.input}
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}

              <input
                type="password"
                placeholder="Confirmar contraseña"
                className={styles.input}
                {...register("confirmPassword", {
                  required: "Debes confirmar la contraseña",
                  validate: (value: any) =>
                    value === watch("password") ||
                    "Las contraseñas no coinciden",
                })}
              />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}
            </>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={!isValid || loading}
          >
            {mode === "register" ? "Registrarse" : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};
