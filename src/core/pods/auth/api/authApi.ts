import { ApiResponseDTO } from "@/core/api-config/DTOs/apiResponseDTO";
import StorageInterface from "@/core/storage/storageInterface";
import { TokenUtils } from "@/core/utils/tokenUtils";
import { AuthResponseDTO } from "../DTOs/authResponseDTO";
import { LoginRequestDTO } from "../DTOs/loginRequestDTO";
import { SignupRequestDTO } from "../DTOs/signUpRequestDTO";
import { User } from "../entities/user";
import { EditUserDTO } from "../../users/DTOs/editUserDTO";
import axios from "axios";
import { AccountResponseDTO } from "../../accounts/DTOs/accountResponseDTO";

export const createAuthRepository = (
  baseUrl: string,
  storage: StorageInterface
) => {
  const tokenUtils = TokenUtils(storage);

  const login = async (request: LoginRequestDTO): Promise<AuthResponseDTO> => {
    try {
      const response = await axios.post(`${baseUrl}/login`, request);
      const dataResponse: AuthResponseDTO = response.data;
      await tokenUtils.handleTokenUpdate(dataResponse.token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during login:",
          error.response?.data || error.message
        );
      }
      throw error;
    }
  };

  const signup = async (
    request: SignupRequestDTO
  ): Promise<AuthResponseDTO> => {
    try {
      const response = await axios.post(`${baseUrl}/signup`, request);
      return response.data;
    } catch (error) {
      console.error("Error signing up", error);
      throw error;
    }
  };

  const getUsers = async (): Promise<User> => {
    try {
      const response = await axios.get(`${baseUrl}/user/me`, {
        headers: tokenUtils.getAuthHeaders(),
      });

      tokenUtils.handleTokenUpdate(response.data.accessToken);

      const responseApi: ApiResponseDTO = response.data;
      return responseApi.data as User;
    } catch (error) {
      console.error("Error getting user details", error);
      throw error;
    }
  };

  const editUser = async (updatedDetails: EditUserDTO): Promise<void> => {
    try {
      const response = await axios.put(
        `${baseUrl}/user/${updatedDetails.id}`,
        updatedDetails,
        { headers: tokenUtils.getAuthHeaders() }
      );
      tokenUtils.handleTokenUpdate(response.data.accessToken);
    } catch (error) {
      console.error("Error updating user details", error);
      throw error;
    }
  };

  const getMyAccount = async (): Promise<AccountResponseDTO> => {
    try {
      const response = await axios.get(`${baseUrl}/accounts/me`, {
        headers: tokenUtils.getAuthHeaders(),
      });
      tokenUtils.handleTokenUpdate(response.data.accessToken);
      return response.data.data as AccountResponseDTO;
    } catch (error) {
      console.error("Error getting account", error);
      throw error;
    }
  };

  const isAuthenticated = async (): Promise<boolean> => {
    return !!tokenUtils.getBearerToken();
  };

  const logout = async (): Promise<void> => {
    tokenUtils.clearToken();
  };

  const getBearerToken = (): string | null => tokenUtils.getBearerToken();

  return {
    login,
    logout,
    signup,
    getUsers,
    editUser,
    getMyAccount,
    isAuthenticated,
    getBearerToken,
  };
};
