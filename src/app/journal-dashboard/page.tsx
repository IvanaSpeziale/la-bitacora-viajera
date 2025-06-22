import { JournalDashboard } from "@/pods/my-travel-journal/components/journal-dashboard/journalDashboard";
import { MyTravelJournalProvider } from "@/pods/my-travel-journal/myTravelJournal.provider";

export default function JournalDashboardPage() {
  return (
    <MyTravelJournalProvider>
      <JournalDashboard />
    </MyTravelJournalProvider>
  );
}
