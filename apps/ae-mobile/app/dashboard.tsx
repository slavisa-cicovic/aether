import { UserProfileHeader } from '@src/components/screens/dashboard/UserProfileHeader';
import { VoiceGatewayCard } from '@src/components/screens/dashboard/VoiceGatewayCard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';


export default function DashboardScreen() {

  const { userId } = useLocalSearchParams<{ userId: string }>();
  const normalizedUserId = Array.isArray(userId) ? userId[0] : userId;

  return (
   <View style={styles.container}>
      <UserProfileHeader userId={normalizedUserId} />
      
      <View style={styles.content}>
        <VoiceGatewayCard />
        {/* Ostale kartice ćeš dodati kasnije */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});