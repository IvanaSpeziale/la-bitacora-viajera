import CreateJournalEntryForm from "@/pods/my-travel-journal/components/create-entry/CreateOrEditJournalEntryForm";
import { MyTravelJournalProvider } from "@/pods/my-travel-journal/myTravelJournal.provider";

export default function JournalEntryPage() {
  return (
    <MyTravelJournalProvider>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <CreateJournalEntryForm />
      </div>
    </MyTravelJournalProvider>
  );
}
