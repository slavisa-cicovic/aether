import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@src/components/ui/icon-symbol';
import { Colors } from '@src/constants/theme';
import { useColorScheme } from '@src/hooks/useColorScheme';
import AppBar from '@src/components/layout/AppBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <AppBar
        title="AetherNet"
        onNotify={() => console.log("notify")}
        onLogout={() => console.log("logout")}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="expapi-test"
          options={{
            title: 'API Test',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
