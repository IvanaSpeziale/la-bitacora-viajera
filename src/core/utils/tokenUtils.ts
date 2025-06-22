import StorageInterface from "../storage/storageInterface";

export const TokenUtils = (storage: StorageInterface) => ({
  getBearerToken: (): string | null => storage.get("bearerToken"),

  getAuthHeaders: (): Record<string, string> => {
    const token = storage.get("bearerToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {};
  },

  handleTokenUpdate: (accessToken: string | null): void => {
    if (accessToken) {
      storage.set("bearerToken", accessToken);
    } else {
      storage.remove("bearerToken");
    }
  },

  clearToken: async (): Promise<void> => {
    await storage.remove("bearerToken");
  },
});
