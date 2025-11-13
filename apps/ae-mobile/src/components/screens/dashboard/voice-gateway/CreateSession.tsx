import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useCreateSession } from '@src/api/voice-gateway';
import { InfoCard } from '@src/components/ui/InfoCard';

export const CreateSession: React.FC = () => {
  const [callSid, setCallSid] = useState('CA1234567890abcdef');
  const [customerPhone, setCustomerPhone] = useState('+381641234567');
  const { session, error, isCreating, createSession, reset } = useCreateSession();

  const handleCreateSession = async () => {
    const request = {
      callSid,
      userPhoneNumber: customerPhone,
      language: 'en-US',
    };
    await createSession(request);
  };

  const handleReset = () => {
    reset();
    setCallSid('CA1234567890abcdef');
    setCustomerPhone('+381641234567');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Voice Session</Text>

      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Call SID *</Text>
          <TextInput
            style={styles.input}
            value={callSid}
            onChangeText={setCallSid}
            placeholder="CA1234567890abcdef"
            editable={!isCreating}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Customer Phone *</Text>
          <TextInput
            style={styles.input}
            value={customerPhone}
            onChangeText={setCustomerPhone}
            placeholder="+381641234567"
            keyboardType="phone-pad"
            editable={!isCreating}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isCreating && styles.buttonDisabled]}
          onPress={handleCreateSession}
          disabled={isCreating || !callSid || !customerPhone}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Session</Text>
          )}
        </TouchableOpacity>

        {(session || error) && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset Form</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Results */}
      {isCreating && (
        <InfoCard
          title="Creating Session..."
          message="Please wait while we create your voice session."
          type="info"
        />
      )}

      {error && (
        <InfoCard
          title="Session Creation Failed"
          message={`${error.error}: ${error.message}`}
          type="error"
        />
      )}

      {session && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>✅ Session Created Successfully</Text>
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionDetail}>Session ID: {session.sessionId}</Text>
            <Text style={styles.sessionDetail}>Call SID: {session.callSid}</Text>
            <Text style={styles.sessionDetail}>Status: {session.status}</Text>
            <Text style={styles.sessionDetail}>
              Created: {new Date(session.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.sessionDetail}>
              Expires: {new Date(session.expiresAt).toLocaleString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  form: {
    maxHeight: 300,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#6b7280',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  successCard: {
    backgroundColor: '#d1fae5',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    marginTop: 16,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 12,
  },
  sessionDetails: {
    gap: 6,
  },
  sessionDetail: {
    fontSize: 14,
    color: '#047857',
    fontFamily: 'monospace',
  },
});