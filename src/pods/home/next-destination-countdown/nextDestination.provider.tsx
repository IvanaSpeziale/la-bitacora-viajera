"use client";
import React, { createContext, useState, useEffect } from "react";
import { NextDestination } from "./entities/nextDestination";
import { createNextDestinationRepository } from "./api/nextDestination.api";
import ApiUrl from "@/core/api-config/apiUrl";
import { BrowserStorage } from "@/core/storage/browserStorage";
import { NextDestinationContextType } from "./vm/nextDestination.vm";
import { NextDestinationDTO } from "./DTOs/nextDestinationDTO";

export const NextDestinationContext = createContext<
  NextDestinationContextType | undefined
>(undefined);

export const NextDestinationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [destinations, setDestinations] = useState<NextDestination[]>([]);
  const [nextDestination, setNextDestination] =
    useState<NextDestination | null>(null);
  // const [trendingActivities, setTrendingActivities] = useState<string[]>([]);
  const nextDestinationRepository = createNextDestinationRepository(
    ApiUrl,
    new BrowserStorage()
  );

  const fetchNextDestinations = async (): Promise<NextDestination[] | null> => {
    try {
      const destinations =
        await nextDestinationRepository.getNextDestinations();
      const mappedDestinations = destinations.map((destination) => ({
        ...destination,
        targetDate: new Date(destination.targetDate),
        createdDate: new Date(destination.createdDate),
      }));

      const sortedDestinations = mappedDestinations.sort(
        (a, b) => a.targetDate.getTime() - b.targetDate.getTime()
      );

      setDestinations(sortedDestinations);
      setNextDestination(sortedDestinations[0] || null);
      return sortedDestinations;
    } catch (error) {
      console.error("Error fetching next destinations:", error);
      return null;
    }
  };

  const addNextDestination = async (
    destination: NextDestinationDTO
  ): Promise<void> => {
    try {
      await nextDestinationRepository.createNextDestination(destination);
      await fetchNextDestinations();
    } catch (error) {
      console.error("Error creating next destination:", error);
    }
  };

  const editNextDestination = async (
    id: string,
    destination: NextDestinationDTO
  ): Promise<void> => {
    try {
      await nextDestinationRepository.updateNextDestination(id, destination);
      await fetchNextDestinations();
    } catch (error) {
      console.error(`Error updating next destination with id ${id}:`, error);
    }
  };

  const removeNextDestination = async (id: string) => {
    try {
      await nextDestinationRepository.deleteNextDestination(id);
      await fetchNextDestinations();
    } catch (error) {
      console.error(`Error deleting next destination with id ${id}:`, error);
    }
  };

  const fetchNextDestinationById = async (
    id: string
  ): Promise<NextDestination | null> => {
    try {
      const destination =
        await nextDestinationRepository.getNextDestinationById(id);
      if (!destination) {
        console.error(`Destination with id ${id} not found`);
        return null;
      }
      const mappedDestination: NextDestination = {
        ...destination,
        targetDate: new Date(destination.targetDate),
        createdDate: new Date(destination.createdDate),
      };
      setNextDestination(mappedDestination);
      return mappedDestination;
    } catch (error) {
      console.error(`Error fetching destination with id ${id}:`, error);
      return null;
    }
  };

  // const fetchTrendingActivities = async (
  //   destinationName: string
  // ): Promise<string[]> => {
  //   try {
  //     const suggestions =
  //       await nextDestinationRepository.fetchTrendingActivities(
  //         destinationName
  //       );
  //     setTrendingActivities(suggestions);
  //     return suggestions;
  //   } catch (error) {
  //     console.error("Error fetching trending activities:", error);
  //     return [];
  //   }
  // };

  useEffect(() => {
    fetchNextDestinations();
  }, []);

  return (
    <NextDestinationContext.Provider
      value={{
        nextDestination,
        nextDestinations: destinations,
        fetchNextDestinations,
        fetchNextDestinationById,
        addNextDestination,
        editNextDestination,
        removeNextDestination,
        // fetchTrendingActivities,
        // trendingActivities,
      }}
    >
      {children}
    </NextDestinationContext.Provider>
  );
};
