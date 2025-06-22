import { NextDestinationProvider } from "@/pods/home/next-destination-countdown/nextDestination.provider";
import Home from "@/pods/home/home";
import { MyTravelJournalProvider } from "@/pods/my-travel-journal/myTravelJournal.provider";

export default function HomePage() {
  return (
    <>
      <MyTravelJournalProvider>
        <NextDestinationProvider>
          <Home />
        </NextDestinationProvider>
      </MyTravelJournalProvider>
    </>
  );
}
