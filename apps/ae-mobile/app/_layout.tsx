// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { authService } from '../src/services/authService';

export default function RootLayout() {
  useEffect(() => {
    // Proveri auth status pri pokretanju app
    authService.isAuthenticated().then(isAuth => {
      console.log('Auth status:', isAuth);
    });
  }, []);

  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#667eea',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'AetherMobile Login',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'AetherMobile Dashboard',
          headerBackVisible: false
        }} 
      />
    </Stack>
  );
}