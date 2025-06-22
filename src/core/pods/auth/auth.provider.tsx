"use client";

import ApiUrl from "@/core/api-config/apiUrl";
import { BrowserStorage } from "@/core/storage/browserStorage";
import { LoginValidation, Validators } from "@/core/utils/validations";
import { createContext, useEffect, useMemo, useState } from "react";
import { createAuthRepository } from "./api/authApi";
import { LoginRequestDTO } from "./DTOs/loginRequestDTO";
import { SignupRequestDTO } from "./DTOs/signUpRequestDTO";
import { AuthContextType } from "./vm/auth.vm";
import { User } from "./entities/user";
import { EditUserDTO } from "../users/DTOs/editUserDTO";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { TokenUtils } from "@/core/utils/tokenUtils";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // --- Estados de autenticación y usuario ---
  const [checkingSession, setCheckingSession] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const authRepository = useMemo(
    () => createAuthRepository(ApiUrl, new BrowserStorage()),
    []
  );

  const tokenUtils = TokenUtils(new BrowserStorage());

  // ------------------------------------------------------------------
  // Funciones auxiliares
  // ------------------------------------------------------------------

  const checkTokenTimeout = async () => {
    try {
      const token = await authRepository.getBearerToken();
      if (!token) {
        logout();
        return;
      }

      const tokenDecoded = jwtDecode(token) as { exp?: number };
      if (!tokenDecoded?.exp) {
        logout();
        return;
      }

      const expirationTime = tokenDecoded.exp * 1000;
      const timeToExpiration = expirationTime - Date.now();

      if (timeToExpiration > 0) {
        setTimeout(() => {
          checkTokenTimeout();
        }, timeToExpiration + 10);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error checking token expiration:", error);
      logout();
    }
  };

  // ------------------------------------------------------------------
  // Verificar si hay sesión activa al montar
  // ------------------------------------------------------------------
  const checkSession = async () => {
    try {
      setCheckingSession(true);
      const isAuthenticated = await authRepository.isAuthenticated();
      if (isAuthenticated) {
        const account = await authRepository.getMyAccount();
        if (account) {
          setIsLoggedIn(true);
          setAccountId(account.accountId);
          setEmail(account.email);
          setUser(await authRepository.getUsers());
          checkTokenTimeout();
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
      logout();
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      checkTokenTimeout();
    }
  }, [isLoggedIn]);

  // ------------------------------------------------------------------
  // login, signup, logout
  // ------------------------------------------------------------------

  const login = async (u: string, p: string) => {
    const email = u.trim().toLocaleLowerCase();
    const password = p.trim();

    try {
      const loginRequest = new LoginRequestDTO(email, password);

      const loginResponse = await authRepository.login(loginRequest);

      if (loginResponse?.token) {
        try {
          const decodedToken = jwtDecode<{ accountId: string; email: string }>(
            loginResponse.token
          );
          tokenUtils.handleTokenUpdate(loginResponse.token);

          setIsLoggedIn(true);
          setAccountId(decodedToken.accountId);
          setEmail(decodedToken.email);
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          return { email: "", password: "Error al procesar el token recibido" };
        }
      }
    } catch (error) {
      console.error("Error en el método login:", error);
      const friendlyMessage =
        "Por favor revisa tu usuario y contraseña, e intenta nuevamente.";
      return {
        email: "",
        password: `${friendlyMessage}`,
      };
    }

    return { email: "", password: "" };
  };

  const signup = async (
    name: string,
    surname: string,
    country: string,
    email: string,
    password: string
  ) => {
    const nameTrimmed = name.trim();
    const surnameTrimmed = surname.trim();
    const countryTrimmed = country.trim();
    const emailTrimmed = email.trim().toLocaleLowerCase();
    const passwordTrimmed = password.trim();

    if (!Validators.isValidUser(nameTrimmed)) {
      return {
        name: "El nombre debe tener al menos 3 caracteres y solo puede contener letras, números, guiones bajos, guiones y puntos",
        surname: "",
        country: "",
        email: "",
        password: "",
      };
    }
    if (!Validators.isValidUser(surnameTrimmed)) {
      return {
        name: "",
        surname:
          "El apellido debe tener al menos 3 caracteres y solo puede contener letras, números, guiones bajos, guiones y puntos",
        country: "",
        email: "",
        password: "",
      };
    }
    if (!Validators.isEmail(emailTrimmed)) {
      return {
        name: "",
        surname: "",
        country: "",
        email: "Formato de correo inválido",
        password: "",
      };
    }
    if (!Validators.isSecurePassword(passwordTrimmed)) {
      return {
        name: "",
        surname: "",
        country: "",
        email: "",
        password:
          "La contraseña debe tener al menos 8 caracteres, incluyendo un número, una letra mayúscula, una letra minúscula y un carácter especial (@#$%^&+=!)",
      };
    }

    const signupRequest = new SignupRequestDTO(
      nameTrimmed,
      surnameTrimmed,
      email,
      passwordTrimmed,
      countryTrimmed
    );

    try {
      const signupResponse = await authRepository.signup(signupRequest);
      if (signupResponse) {
        setIsLoggedIn(true);
        setAccountId(signupResponse.accountId);
        setEmail(signupResponse.email);
      }
      return { name: "", surname: "", country: "", email: "", password: "" };
    } catch (error) {
      if (error instanceof Error) {
        return {
          name: "",
          surname: "",
          country: "",
          email: error.message,
          password: "",
        };
      }
      return {
        name: "",
        surname: "",
        country: "",
        email: "",
        password: "Error desconocido",
      };
    }
  };

  const logout = async () => {
    await authRepository.logout();
    setIsLoggedIn(false);
    setAccountId(null);
    setEmail(null);
    setUser(null);
    router.push("/login");
  };

  const editUser = async (updatedDetails: EditUserDTO) => {
    try {
      await authRepository.editUser(updatedDetails);
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          id: updatedDetails.id || prev.id,
          name: updatedDetails.name || prev.name,
          surname: updatedDetails.surname || prev.surname,
          email: updatedDetails.email || prev.email,
          country: updatedDetails.country || prev.country,
        };
      });
      toast.success("Modificado correctamente");
    } catch (error) {
      toast.error("Error al modificar el usuario");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        checkingSession,
        login,
        signup,
        logout,
        editUser,
        isLoggedIn,
        accountId,
        email,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
