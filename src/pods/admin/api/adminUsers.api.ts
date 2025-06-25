import axios from "axios";
import { TokenUtils } from "@/core/utils/tokenUtils";
import StorageInterface from "@/core/storage/storageInterface";
import { User } from "../../../core/pods/auth/entities/user";

export const createAdminRepository = (
  baseUrl: string,
  storage: StorageInterface
) => {
  const tokenUtils = TokenUtils(storage);

  const getAuthHeaders = () => {
    const token = tokenUtils.getBearerToken();
    console.log("[ADMIN API] Token enviado:", token);
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const getAdminUsers = async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${baseUrl}/admin/users`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const getUserById = async (id: string): Promise<User> => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${baseUrl}/admin/users/${id}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`${baseUrl}/admin/users/${id}`, {
        headers,
      });
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  };

  const editUser = async (user: User): Promise<void> => {
    try {
      const headers = {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      };
      await axios.put(`${baseUrl}/admin/users/${user.id}/role`, user, {
        headers,
      });
    } catch (error) {
      console.error(`Error editing user with id ${user.id}:`, error);
      throw error;
    }
  };

  return {
    getAdminUsers,
    getUserById,
    deleteUser,
    editUser,
  };
};
