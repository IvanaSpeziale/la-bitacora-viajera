import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import styles from "./LatestUsersListCard.module.scss";
import { User } from "@/core/pods/auth/entities/user";

interface UserCardProps {
  user: User;
  isEditing: boolean;
  newRole: string;
  onEditRole: (user: User) => void;
  onSaveRole: (user: User) => void;
  onDelete: (id: string) => void;
  setNewRole: (role: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  isEditing,
  newRole,
  onEditRole,
  onSaveRole,
  onDelete,
  setNewRole,
}) => {
  const getInitials = (name?: string, surname?: string) => {
    return `${name?.[0] ?? ""}${surname?.[0] ?? ""}`.toUpperCase();
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatarSection}>
        <div className={styles.avatar}>
          {getInitials(user.name, user.surname)}
        </div>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.name}>
          {user.name} {user.surname}
        </div>
        <div className={styles.email}>{user.email}</div>
        <div className={styles.country}>{user.country}</div>
        <div className={styles.roleRow}>
          <span className={styles.roleLabel}>Rol:</span>
          {isEditing ? (
            <select
              className={styles.roleSelect}
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          ) : user.is_admin ? (
            <span className={styles.roleAdmin}>Admin</span>
          ) : (
            <span className={styles.roleUser}>Usuario</span>
          )}
        </div>
      </div>
      <div className={styles.actionsSection}>
        <button
          onClick={() => onDelete(user.id)}
          className={styles.deleteBtn}
          title="Eliminar"
        >
          <FaTrash />
        </button>
        {isEditing ? (
          <button onClick={() => onSaveRole(user)} className={styles.saveBtn}>
            Guardar
          </button>
        ) : (
          <button
            onClick={() => onEditRole(user)}
            className={styles.editBtn}
            title="Editar rol"
          >
            <FaEdit />
          </button>
        )}
      </div>
    </div>
  );
};
