"use client";
import { User } from "@/core/pods/auth/entities/user";
import { useAuth } from "@/core/pods/auth/hook/useAuth";
import React, { useEffect, useState } from "react";
import styles from "./LatestUsersListCard.module.scss";
import { UserCard } from "./UserCard";

const UsersListCard: React.FC = () => {
  const { isLoggedIn, fetchAdminUsers, deleteUser, editAdminUser } = useAuth();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAdminUsers().then((fetchedUsers) => {
        setUsers(fetchedUsers ?? []);
      });
    }
  }, [isLoggedIn, fetchAdminUsers]);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      await deleteUser(id);
      const fetchedUsers = await fetchAdminUsers();
      setUsers(fetchedUsers ?? []);
    }
  };

  const handleEditRole = (user: User) => {
    setEditingUserId(user.id);
    setNewRole(user.is_admin ? "user" : "admin");
  };
  const handleSaveRole = async (user: User) => {
    if (newRole === "admin" || newRole === "user") {
      await editAdminUser({
        ...user,
        is_admin: newRole === "admin",
      });
      setEditingUserId(null);
      const fetchedUsers = await fetchAdminUsers();
      setUsers(fetchedUsers ?? []);
    }
  };

  return (
    <div className={styles.gridContainer}>
      {(users ?? []).map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isEditing={editingUserId === user.id}
          newRole={newRole}
          onEditRole={handleEditRole}
          onSaveRole={handleSaveRole}
          onDelete={handleDelete}
          setNewRole={setNewRole}
        />
      ))}
    </div>
  );
};

export default UsersListCard;
