import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useHealthCheck } from '@src/api/voice-gateway';
import { InfoCard } from '@src/components/ui/InfoCard';

export const Health: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useHealthCheck({ detailed: true });

  console.log('Voice Gateway Health Data:', isLoading, data, error);
  if (isLoading) {
    return (
      <View style={styles.healthCard}>
        <View style={styles.healthHeader}>
          <Text style={styles.healthTitle}>Voice Gateway Health</Text>
          <ActivityIndicator size="small" color="#667eea" />
        </View>
        <Text style={styles.healthLoadingText}>Checking service health...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <>
        <InfoCard
          title="Voice Gateway Health"
          message={`Failed to check health: ${error.message}`}
          type="error"
        />
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => refetch()}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </>
    );
  }

  if (!data) {
    return (
      <InfoCard
        title="Voice Gateway Health"
        message="No health data available"
        type="warning"
      />
    );
  }

  const isHealthy = data.status === 'UP';

  return (
    <View style={[
      styles.healthCard,
      isHealthy ? styles.healthCardSuccess : styles.healthCardError
    ]}>
      <View style={styles.healthHeader}>
        <Text style={styles.healthTitle}>Voice Gateway Health</Text>
        <Text style={styles.healthStatusIcon}>
          {isHealthy ? '✅' : '❌'}
        </Text>
      </View>

      <View style={styles.healthDetails}>
        <Text style={styles.healthService}>
          Service: {data.service}
        </Text>
        <Text style={[
          styles.healthStatus,
          isHealthy ? styles.healthStatusUp : styles.healthStatusDown
        ]}>
          Status: {data.status}
        </Text>

        {data.timestamp && (
          <Text style={styles.healthTimestamp}>
            Last checked: {new Date(data.timestamp).toLocaleString()}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => refetch()}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  healthCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthCardSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  healthCardError: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  healthStatusIcon: {
    fontSize: 20,
  },
  healthDetails: {
    gap: 8,
    marginBottom: 12,
  },
  healthService: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  healthStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  healthStatusUp: {
    color: '#10b981',
  },
  healthStatusDown: {
    color: '#ef4444',
  },
  healthTimestamp: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  healthLoadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  refreshButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});