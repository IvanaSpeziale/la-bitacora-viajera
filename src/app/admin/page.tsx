import LatestEntriesListCard from "@/pods/admin/components/latest-entries/LatestEntriesListCard";
import LatestUsersListCard from "@/pods/admin/components/latest-users/LatestUsersListCard";
import ListCard from "@/pods/admin/components/list-card/ListCard";
import { MyTravelJournalProvider } from "@/pods/my-travel-journal/myTravelJournal.provider";
import styles from "@/pods/admin/components/list-card/ListCard.module.scss";

export default function JournalEntryPage() {
  return (
    <MyTravelJournalProvider>
      <div className={styles.dashboardGrid}>
        <ListCard title="Últimos usuarios" seeMoreLink="/admin/users">
          <LatestUsersListCard />
        </ListCard>
        <ListCard title="Últimas entradas" seeMoreLink="/admin/latest-entries">
          <LatestEntriesListCard />
        </ListCard>
      </div>
    </MyTravelJournalProvider>
  );
}
