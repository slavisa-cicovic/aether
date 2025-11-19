import { Tabs, useRouter } from "expo-router";
import React from "react";

import AppBar from "@src/components/layout/AppBar";
import { IconSymbol } from "@src/components/ui/icon-symbol";
import { Colors } from "@src/constants/theme";
import { useColorScheme } from "@src/hooks/useColorScheme";
import { useAuthStore } from "@src/state/authStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      <AppBar
        title="AetherNet"
        onNotify={() => console.log("notify")}
        onLogout={handleLogout}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="api-test"
          options={{
            title: "API Test",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
