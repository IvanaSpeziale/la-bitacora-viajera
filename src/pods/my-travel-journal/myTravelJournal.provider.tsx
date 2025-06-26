"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import { MyTravelJournalContextType } from "./vm/journalEntry.vm";
import { BrowserStorage } from "@/core/storage/browserStorage";
import ApiUrl from "@/core/api-config/apiUrl";
import { createMyTravelJournalRepository } from "./api/myTravelJournal.api";
import { Location } from "./entities/location";
import { JournalEntry } from "./entities/journalEntry";

export const MyTravelJournalContext = createContext<
  MyTravelJournalContextType | undefined
>(undefined);

export const MyTravelJournalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const myTravelJournalRepository = createMyTravelJournalRepository(
    ApiUrl,
    new BrowserStorage()
  );

  const transformEntries = (entries: any[]): JournalEntry[] => {
    return entries.map((entry) => ({
      id: entry.id || "",
      userId: entry.userId,
      locations: entry.locations,
      date: new Date(entry.date).toISOString(),
      description: entry.description,
      dailyExpenses: entry.dailyExpenses,
      favorite: entry.favorite,
      leastFavorite: entry.leastFavorite,
      score: entry.score,
      imageUrls:
        typeof entry.imageUrls === "string"
          ? JSON.parse(entry.imageUrls)
          : entry.imageUrls || [],
    }));
  };

  const fetchEntries = async (): Promise<
    MyTravelJournalContextType["entries"] | null
  > => {
    try {
      const data = await myTravelJournalRepository.getAllJournalEntries();
      const transformedEntries = transformEntries(data);
      setEntries(transformedEntries);
      return transformedEntries;
    } catch (error) {
      console.error("Error fetching entries:", error);
      return null;
    }
  };

  const fetchMyEntries = async (): Promise<
    MyTravelJournalContextType["entries"] | null
  > => {
    try {
      const data = await myTravelJournalRepository.getMyJournalEntries();
      const transformedEntries = transformEntries(data);
      setEntries(transformedEntries);
      return transformedEntries;
    } catch (error) {
      console.error("Error fetching entries:", error);
      return null;
    }
  };

  const fetchEntryById = async (id: string): Promise<JournalEntry | null> => {
    try {
      const entry = await myTravelJournalRepository.getJournalEntryById(id);
      const transformedEntry: JournalEntry = {
        id: entry.id || "",
        locations: entry.locations,
        date: new Date(entry.date).toISOString(),
        description: entry.description,
        dailyExpenses: entry.dailyExpenses,
        favorite: entry.favorite,
        leastFavorite: entry.leastFavorite,
        score: entry.score,
        imageUrls:
          typeof entry.imageUrls === "string"
            ? JSON.parse(entry.imageUrls)
            : entry.imageUrls || [],
      };
      setEntry(transformedEntry);
      return transformedEntry;
    } catch (error) {
      console.error(`Error fetching entry with id ${id}:`, error);
      return null;
    }
  };

  const addEntry = async (entry: FormData) => {
    await myTravelJournalRepository.createJournalEntry(entry);
    await fetchMyEntries();
  };

  const editEntry = async (id: string, entry: FormData) => {
    await myTravelJournalRepository.updateJournalEntry(id, entry);
    await fetchMyEntries();
  };

  const removeEntry = async (id: string) => {
    await myTravelJournalRepository.deleteJournalEntry(id);
    await fetchMyEntries();
  };

  const searchLocations = async (query: string): Promise<Location[]> => {
    const results = await myTravelJournalRepository.searchLocations(query);
    return results.map((location: any) => ({
      name: location.name || location.display_name,
      lat: location.lat || location.latitude,
      lon: location.lon || location.longitude,
    }));
  };

  useEffect(() => {
    fetchEntries();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MyTravelJournalContext.Provider
      value={{
        entries,
        entry,
        fetchEntries,
        fetchMyEntries,
        fetchEntryById,
        addEntry,
        editEntry,
        removeEntry,
        searchLocations,
      }}
    >
      {children}
    </MyTravelJournalContext.Provider>
  );
};
