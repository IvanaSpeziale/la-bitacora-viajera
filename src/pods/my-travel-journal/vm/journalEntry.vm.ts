import { JournalEntry } from "../entities/journalEntry";
import { Location } from "../entities/location";

export interface MyTravelJournalContextType {
  entries: JournalEntry[];
  entry: JournalEntry | null;
  fetchEntries: () => Promise<JournalEntry[] | null>;
  fetchMyEntries: () => Promise<JournalEntry[] | null>;
  fetchEntryById: (id: string) => Promise<JournalEntry | null>;
  addEntry: (entry: FormData) => Promise<void>;
  editEntry: (id: string, entry: FormData) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  searchLocations: (query: string) => Promise<Location[]>;
}
