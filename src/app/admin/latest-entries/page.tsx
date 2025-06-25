import { MyTravelJournalProvider } from "@/pods/my-travel-journal/myTravelJournal.provider";
import { LatestEntriesDashboard } from "@/pods/admin/components/latest-entries/latest-entries-dashboard/latestEntriesDashboard";

export default function JournalEntryPage() {
  return (
    <MyTravelJournalProvider>
      <LatestEntriesDashboard />
    </MyTravelJournalProvider>
  );
}
