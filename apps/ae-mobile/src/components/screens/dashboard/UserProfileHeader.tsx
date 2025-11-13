import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useGetUser } from '@src/api/user';

type Props = {
  userId?: string;
};

export const UserProfileHeader: React.FC<Props> = ({ userId }) => {
  const { user, isLoading, error, refetch } = useGetUser({ userId });

  if (isLoading) {
    return (
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Loading user...</Text>
        </View>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Guest User</Text>
          <Text style={styles.userEmail}>Not available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      
      <TouchableOpacity style={styles.refreshButton} onPress={() => refetch()}>
        <Text style={styles.refreshButtonText}>🔄</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  loadingText: {
    fontSize: 14,
    color: '#e2e8f0',
    marginLeft: 8,
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});