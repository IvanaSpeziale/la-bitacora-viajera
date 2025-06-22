import axios from "axios";
import { TokenUtils } from "@/core/utils/tokenUtils";
import StorageInterface from "@/core/storage/storageInterface";

export interface NextDestination {
  id: string;
  name: string;
  targetDate: string;
  createdDate: string;
}

export const createNextDestinationRepository = (
  baseUrl: string,
  storage: StorageInterface
) => {
  const tokenUtils = TokenUtils(storage);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${tokenUtils.getBearerToken()}`,
  });

  const getNextDestinations = async (): Promise<NextDestination[]> => {
    try {
      const response = await axios.get(`${baseUrl}/next-destinations/me`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching next destinations:", error);
      throw error;
    }
  };

  const getNextDestinationById = async (
    id: string
  ): Promise<NextDestination> => {
    try {
      const response = await axios.get(`${baseUrl}/next-destinations/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching next destination with id ${id}:`, error);
      throw error;
    }
  };

  const createNextDestination = async (
    data: NextDestination
  ): Promise<void> => {
    try {
      await axios.post(`${baseUrl}/next-destinations/create`, data, {
        headers: {
          Authorization: `Bearer ${tokenUtils.getBearerToken()}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error creating next destination:", error);
      throw error;
    }
  };

  const updateNextDestination = async (
    id: string,
    data: NextDestination
  ): Promise<void> => {
    try {
      await axios.put(`${baseUrl}/next-destinations/${id}`, data, {
        headers: {
          Authorization: `Bearer ${tokenUtils.getBearerToken()}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(`Error updating next destination with id ${id}:`, error);
      throw error;
    }
  };

  const deleteNextDestination = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${baseUrl}/next-destinations/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error(`Error deleting next destination with id ${id}:`, error);
      throw error;
    }
  };

  // const fetchTrendingActivities = async (destination: string) => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/destination-trends`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ destination }),
  //       }
  //     );

  //     if (!res.ok) {
  //       const errorDetails = await res.text();
  //       console.error("Error fetching trending activities:", errorDetails);
  //       throw new Error("Error fetching trending activities");
  //     }

  //     const data = await res.json();
  //     return data.activities;
  //   } catch (error) {
  //     console.error("Unexpected error fetching trending activities:", error);
  //     throw error;
  //   }
  // };

  return {
    getNextDestinations,
    getNextDestinationById,
    createNextDestination,
    updateNextDestination,
    deleteNextDestination,
    // fetchTrendingActivities,
  };
};
