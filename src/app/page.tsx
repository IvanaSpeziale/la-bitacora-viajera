"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/core/pods/auth/auth.provider";
import { NextDestinationProvider } from "@/pods/home/next-destination-countdown/nextDestination.provider";
import Home from "@/pods/home/home";
import { MyTravelJournalProvider } from "@/pods/my-travel-journal/myTravelJournal.provider";

export default function HomePage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authContext && !authContext.isLoggedIn) {
      router.replace("/login");
    }
  }, [authContext, router]);

  if (!authContext || !authContext.isLoggedIn) {
    return null;
  }

  return (
    <MyTravelJournalProvider>
      <NextDestinationProvider>
        <Home />
      </NextDestinationProvider>
    </MyTravelJournalProvider>
  );
}
