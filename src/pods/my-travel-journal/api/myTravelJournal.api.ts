import axios from "axios";
import { TokenUtils } from "@/core/utils/tokenUtils";
import StorageInterface from "@/core/storage/storageInterface";
import { JournalEntry } from "../entities/journalEntry";

export const createMyTravelJournalRepository = (
  baseUrl: string,
  storage: StorageInterface
) => {
  const tokenUtils = TokenUtils(storage);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${tokenUtils.getBearerToken()}`,
  });

  const getMyJournalEntries = async (): Promise<JournalEntry[]> => {
    try {
      const response = await axios.get(`${baseUrl}/journal-my-entries/user`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      throw error;
    }
  };

  const getJournalEntryById = async (id: string): Promise<JournalEntry> => {
    try {
      const response = await axios.get(`${baseUrl}/journal-entries/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching journal entry with id ${id}:`, error);
      console.error(`URL: ${baseUrl}/journal-entries/${id}`);
      throw error;
    }
  };

  const createJournalEntry = async (formData: FormData): Promise<void> => {
    try {
      await axios.post(`${baseUrl}/journal-entries/create`, formData, {
        headers: {
          Authorization: `Bearer ${tokenUtils.getBearerToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error creating journal entry:", error);
      throw error;
    }
  };

  const updateJournalEntry = async (
    id: string,
    formData: FormData
  ): Promise<void> => {
    try {
      await axios.put(`${baseUrl}/journal-entries/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${tokenUtils.getBearerToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(`Error updating journal entry with id ${id}:`, error);
      throw error;
    }
  };

  const deleteJournalEntry = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${baseUrl}/journal-entries/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error(`Error deleting journal entry with id ${id}:`, error);
      throw error;
    }
  };

  const searchLocations = async (query: string): Promise<Location[]> => {
    try {
      const response = await axios.get(
        `${baseUrl}/location/search?query=${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching locations:", error);
      throw error;
    }
  };

  const getAllJournalEntries = async (): Promise<JournalEntry[]> => {
    try {
      const response = await axios.get(`${baseUrl}/journal-entries`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all journal entries:", error);
      throw error;
    }
  };

  return {
    getMyJournalEntries,
    getJournalEntryById,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    searchLocations,
    getAllJournalEntries,
  };
};
