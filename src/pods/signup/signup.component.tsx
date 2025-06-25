"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import ApiUrl from "@/core/api-config/apiUrl";
import { SignupRequestDTO } from "@/core/pods/auth/DTOs/signUpRequestDTO";
import styles from "./signup.module.scss";
import BackArrow from "@/core/commons/components/backArrow";
import { useRouter } from "next/navigation";

const Signup: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupRequestDTO>({
    mode: "onChange",
  });

  const onSubmit = async (data: SignupRequestDTO) => {
    try {
      const signupData = new SignupRequestDTO(
        data.name,
        data.surname,
        data.email,
        data.password,
        data.country
      );

      const response = await axios.post(`${ApiUrl}/signup`, signupData);
      toast.success("Registro exitoso");
      console.log("Usuario registrado:", response.data);
      router.push("/login");
    } catch (err: any) {
      console.error("Error al registrar:", err);
      setError("Error al registrar. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <BackArrow />
        <h2 className="text-center mb-4">Registro</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            disabled
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/,
                message: "El email no es válido",
              },
            })}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}

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
                value === watch("password") || "Las contraseñas no coinciden",
            })}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword.message}</p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={!isValid}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
