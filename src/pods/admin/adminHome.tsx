import React from "react";
import styles from "./adminHome.module.scss";
import LatestEntriesListCard from "./components/latest-entries/LatestEntriesListCard";
import LatestUsersListCard from "./components/latest-users/LatestUsersListCard";

const AdminHome: React.FC = () => {
  return (
    <div className={styles.adminHomeContainer}>
      <h1>Panel de Administrador</h1>
      <div className={styles.cardsContainer}>
        <LatestEntriesListCard />
        <LatestUsersListCard />
      </div>
    </div>
  );
};

export default AdminHome;
