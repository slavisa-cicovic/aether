import { SessionCreateRequest } from '@src/api/types/voice-gateway';
import { useCreateSession, useHealthCheck } from '@src/api/voice-gateway';
import { InfoCard } from '@src/components/ui/InfoCard';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddressVerification } from './voice-gateway/AddressVerification';
import { MerchantVerification } from './voice-gateway/MerchantVerification';

type ActiveSection = 'health' | 'create-session' | 'verify-address' | 'verify-merchant' | 'sessions' | 'analytics';

export const VoiceGatewayCard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('health');

  // Health check hook
  const { data: healthData, isLoading: healthLoading, error: healthError, refetch: refetchHealth } = useHealthCheck();

  // Create session hook
  const { session, error: sessionError, isCreating, createSession } = useCreateSession();
  
  const renderHealthSection = () => {
    if (healthLoading) {
      return (
        <View style={styles.sectionContent}>
          <ActivityIndicator size="small" color="#667eea" />
          <Text style={styles.loadingText}>Checking service health...</Text>
        </View>
      );
    }

    if (healthError) {
      return (
        <View style={styles.sectionContent}>
          <InfoCard
            title="Health Check Failed"
            message={healthError.message}
            type="error"
          />
          <TouchableOpacity style={styles.retryButton} onPress={() => refetchHealth()}>
            <Text style={styles.retryButtonText}>Retry Health Check</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!healthData) {
      return (
        <View style={styles.sectionContent}>
          <Text style={styles.noDataText}>No health data available</Text>
        </View>
      );
    }

    const isHealthy = healthData.status === 'UP';

    return (
      <View style={styles.sectionContent}>
        <View style={[styles.healthStatus, isHealthy ? styles.healthStatusUp : styles.healthStatusDown]}>
          <Text style={styles.healthStatusIcon}>{isHealthy ? '✅' : '❌'}</Text>
          <View style={styles.healthDetails}>
            <Text style={styles.healthService}>{healthData.service}</Text>
            <Text style={styles.healthStatusText}>Status: {healthData.status}</Text>
            {healthData.timestamp && (
              <Text style={styles.healthTimestamp}>
                Last checked: {new Date(healthData.timestamp).toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={() => refetchHealth()}>
          <Text style={styles.refreshButtonText}>Refresh Health</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCreateSessionSection = () => {
    const handleTestSession = async () => {
      const request: SessionCreateRequest = {
        callSid: `CA${Date.now()}`,
        userPhoneNumber: `+381641234567${Math.floor(Math.random() * 9) + 1}`,
        language: 'sr-Latn',
      };

      await createSession(request);
    };

    return (
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Create a new voice session for order placement
        </Text>

        <TouchableOpacity
          style={[styles.createSessionButton, isCreating && styles.buttonDisabled]}
          onPress={handleTestSession}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.createSessionButtonText}>Create Test Session</Text>
          )}
        </TouchableOpacity>

        {sessionError && (
          <InfoCard
            title="Session Creation Failed"
            message={`${sessionError.error}: ${sessionError.message}`}
            type="error"
          />
        )}

        {session && (
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>✅ Session Created</Text>
            <Text style={styles.sessionId}>ID: {session.sessionId}</Text>
            <Text style={styles.sessionDetail}>Status: {session.status}</Text>
            <Text style={styles.sessionDetail}>{session.welcomeMessage}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSessionsSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.comingSoonText}>Active Sessions - Coming Soon</Text>
      <Text style={styles.comingSoonDescription}>
        This section will display all active voice sessions and their status.
      </Text>
    </View>
  );

  const renderAnalyticsSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.comingSoonText}>Analytics - Coming Soon</Text>
      <Text style={styles.comingSoonDescription}>
        Voice gateway performance metrics and analytics dashboard.
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Voice Gateway</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, healthData?.status === 'UP' ? styles.statusDotUp : styles.statusDotDown]} />
          <Text style={styles.statusText}>
            {healthLoading ? 'Checking...' : healthData?.status || 'Unknown'}
          </Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {([
            { id: 'health' as ActiveSection, label: 'Health' },
            { id: 'create-session' as ActiveSection, label: 'Create Session' },
            { id: 'verify-address' as ActiveSection, label: 'Verify Address' },
            { id: 'verify-merchant' as ActiveSection, label: 'Verify Merchant' },
            { id: 'sessions' as ActiveSection, label: 'Sessions' },
            { id: 'analytics' as ActiveSection, label: 'Analytics' },
          ]).map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeSection === tab.id && styles.tabActive]}
              onPress={() => setActiveSection(tab.id)}
            >
              <Text style={[styles.tabText, activeSection === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Active Section Content */}
      <View style={styles.sectionContainer}>
        {activeSection === 'health' && renderHealthSection()}
        {activeSection === 'create-session' && renderCreateSessionSection()}
        {activeSection === 'verify-address' && <AddressVerification sessionId={session?.sessionId} />}
        {activeSection === 'verify-merchant' && <MerchantVerification sessionId={session?.sessionId} />}
        {activeSection === 'sessions' && renderSessionsSection()}
        {activeSection === 'analytics' && renderAnalyticsSection()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotUp: {
    backgroundColor: '#10b981',
  },
  statusDotDown: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  sectionContainer: {
    minHeight: 150,
  },
  sectionContent: {
    gap: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  healthStatusUp: {
    backgroundColor: '#d1fae5',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  healthStatusDown: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  healthStatusIcon: {
    fontSize: 24,
  },
  healthDetails: {
    flex: 1,
  },
  healthService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 4,
  },
  healthStatusText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '500',
  },
  healthTimestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
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
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  createSessionButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  createSessionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#d1fae5',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  successTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 8,
  },
  sessionId: {
    fontSize: 12,
    color: '#047857',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  sessionDetail: {
    fontSize: 12,
    color: '#047857',
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});