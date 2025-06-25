// "use client";
// import ApiUrl from "@/core/api-config/apiUrl";
// import { BrowserStorage } from "@/core/storage/browserStorage";
// import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { TokenUtils } from "@/core/utils/tokenUtils";
// import { User } from "@/core/pods/auth/entities/user";
// import { EditUserDTO } from "@/core/pods/auth/DTOs/editUserDTO";
// import { AdminContextType } from "./vm/admin.vm";
// import { createAdminRepository } from "./api/adminUsers.api";

// export const AdminContext = createContext<AdminContextType | undefined>(
//   undefined
// );

// export const AdminProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const router = useRouter();

//   const tokenUtils = TokenUtils(new BrowserStorage());

//   const adminRepository = createAdminRepository(ApiUrl, new BrowserStorage());

//   const fetchUsers = async (): Promise<User[] | null> => {
//     try {
//       const fetchedUsers = await adminRepository.getUsers();
//       const usersArray = Array.isArray(fetchedUsers)
//         ? fetchedUsers
//         : [fetchedUsers];
//       setUsers(usersArray);
//       return usersArray;
//     } catch (error) {
//       toast.error("Error al obtener los usuarios");
//       return null;
//     }
//   };

//   const fetchUserById = async (id: string) => {
//     try {
//       const fetchedUser = await adminRepository.getUserById(id);
//       setUser(fetchedUser);
//       return fetchedUser;
//     } catch (error) {
//       toast.error("Error al obtener el usuario");
//       return null;
//     }
//   };

//   const editUser = async (updatedDetails: EditUserDTO) => {
//     try {
//       setUser((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           id: updatedDetails.id || prev.id,
//           name: updatedDetails.name || prev.name,
//           surname: updatedDetails.surname || prev.surname,
//           email: updatedDetails.email || prev.email,
//           country: updatedDetails.country || prev.country,
//         };
//       });
//       // Ensure 'account' is included when calling editUser
//       await adminRepository.editUser({
//         ...(user as User),
//         ...updatedDetails,
//       });
//       toast.success("Modificado correctamente");
//     } catch (error) {
//       toast.error("Error al modificar el usuario");
//     }
//   };

//   const deleteUser = async (id: string) => {
//     try {
//       await adminRepository.deleteUser(id);
//       setUsers((prev) => prev.filter((user) => user.id !== id));
//       if (user?.id === id) {
//         setUser(null);
//         tokenUtils.clearToken();
//         router.push("/auth/login");
//       }
//       toast.success("Usuario eliminado correctamente");
//     } catch (error) {
//       toast.error("Error al eliminar el usuario");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <AdminContext.Provider
//       value={{
//         editUser,
//         user,
//         users,
//         fetchUsers,
//         fetchUserById,
//         deleteUser,
//       }}
//     >
//       {children}
//     </AdminContext.Provider>
//   );
// };
