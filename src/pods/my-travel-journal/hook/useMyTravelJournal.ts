import { useContext } from "react";
import { MyTravelJournalContext } from "../myTravelJournal.provider";
import { MyTravelJournalContextType } from "../vm/journalEntry.vm";

export const useMyTravelJournal = (): MyTravelJournalContextType => {
  const context = useContext(MyTravelJournalContext);
  if (!context) {
    throw new Error(
      "useMyTravelJournal must be used within a MyTravelJournalProvider"
    );
  }
  return context;
};
