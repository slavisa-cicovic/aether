import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse, LoginCredentials } from "@src/api/types/auth";
import { User } from "@src/api/types/user";

const fakeDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await fakeDelay(1500);

      if (!credentials.email || !credentials.password) {
        throw new Error("Email and password are required");
      }

      console.log("Logging in with credentials:", credentials);

      if (
        credentials.email === "demo@aether.com" &&
        credentials.password === "password"
      ) {
        const fakeUser: User = {
          id: "1",
          email: credentials.email,
          name: "Demo User",
        };

        const fakeToken = "fake-jwt-token-" + Date.now();

        const response: AuthResponse = {
          token: fakeToken,
          user: fakeUser,
        };

        await AsyncStorage.setItem("authToken", fakeToken);
        await AsyncStorage.setItem("user", JSON.stringify(fakeUser));

        return response;
      } else {
        // Za bilo koji drugi email/password kombinaciju prihvatamo kao validnu
        // ali sa generičkim podacima
        const fakeUser: User = {
          id: Date.now().toString(),
          email: credentials.email,
          name: credentials.email.split("@")[0], // Koristimo prefix emaila kao ime
        };

        const fakeToken = "fake-jwt-token-" + Date.now();

        const response: AuthResponse = {
          token: fakeToken,
          user: fakeUser,
        };

        await AsyncStorage.setItem("authToken", fakeToken);
        await AsyncStorage.setItem("user", JSON.stringify(fakeUser));

        return response;
      }
    } catch (error) {
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem("authToken");
  },

  async getUser(): Promise<User | null> {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },
};
