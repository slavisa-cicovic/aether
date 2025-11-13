import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useVerifyAddress } from '@src/api/voice-gateway';
import { InfoCard } from '@src/components/ui/InfoCard';

type Props = {
  sessionId?: string;
};

export const AddressVerification: React.FC<Props> = ({ sessionId }) => {
  const [spokenAddress, setSpokenAddress] = useState(`Bulevar kralja Aleksandra ${Math.floor(Math.random() * 200) + 1}, Beograd`);

  const {
    verification,
    error,
    isVerifying,
    verifyAddress,
    reset
  } = useVerifyAddress();

  const handleVerifyAddress = async () => {
    if (!sessionId) {
      console.error('❌ Session ID is required for address verification');
      return;
    }

    const request = {
      spokenAddress: spokenAddress.trim(),
    };

    await verifyAddress({ sessionId, request });
  };

  const handleReset = () => {
    reset();
    setSpokenAddress(`Bulevar kralja Aleksandra ${Math.floor(Math.random() * 200) + 1}, Beograd`);
  };

  if (!sessionId) {
    return (
      <InfoCard
        title="Address Verification"
        message="Create a session first to verify addresses"
        type="warning"
      />
    );
  }

  return (
    <View style={styles.fullHeightContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Verify Address</Text>
          <Text style={styles.sessionInfo}>Session: {sessionId}</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Spoken Address *</Text>
              <TextInput
                style={styles.textArea}
                value={spokenAddress}
                onChangeText={setSpokenAddress}
                placeholder="Enter the address as spoken by the user..."
                multiline
                numberOfLines={3}
                editable={!isVerifying}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isVerifying && styles.buttonDisabled]}
              onPress={handleVerifyAddress}
              disabled={isVerifying || !spokenAddress.trim()}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify Address</Text>
              )}
            </TouchableOpacity>

            {(verification || error) && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Results */}
          {isVerifying && (
            <InfoCard
              title="Verifying Address..."
              message="Please wait while we verify and geocode the address."
              type="info"
            />
          )}

          {error && (
            <View style={[
              styles.resultCard,
              error.status === 422 ? styles.ambiguousCard : styles.errorCard
            ]}>
              <Text style={styles.resultTitle}>
                {error.status === 422 ? '🔄 Address Ambiguous' : '❌ Verification Failed'}
              </Text>
              <Text style={styles.resultMessage}>
                {error.message}
              </Text>
            </View>
          )}

          {verification && (
            <View style={[
              styles.resultCard,
              styles.successCard
            ]}>
              <Text style={styles.resultMessage}>
                {verification.responseMessage}
              </Text>

              {verification.confidenceScore && (
                <Text style={styles.confidence}>
                  Confidence: {(verification.confidenceScore * 100).toFixed(1)}%
                </Text>
              )}

              {verification.verifiedAddress && (
                <View style={styles.addressDetails}>
                  <Text style={styles.addressTitle}>Verified Address:</Text>
                  <Text style={styles.addressLine}>
                    {verification.verifiedAddress.street}
                  </Text>
                  <Text style={styles.addressLine}>
                    {verification.verifiedAddress.city}, {verification.verifiedAddress.postalCode}
                  </Text>
                  <Text style={styles.addressLine}>
                    {verification.verifiedAddress.country}
                  </Text>
                  {verification.verifiedAddress.formattedAddress && (
                    <Text style={styles.formattedAddress}>
                      {verification.verifiedAddress.formattedAddress}
                    </Text>
                  )}
                  {verification.verifiedAddress.latitude && verification.verifiedAddress.longitude && (
                    <Text style={styles.coordinates}>
                      📍 {verification.verifiedAddress.latitude.toFixed(6)}, {verification.verifiedAddress.longitude.toFixed(6)}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  fullHeightContainer: {
    height: screenHeight * 0.6,
  },
  scrollView: {
    
  },
  scrollContent: {
    flexGrow: 1,
  },
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
    marginBottom: 8,
  },
  sessionInfo: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
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
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  resultCard: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  successCard: {
    backgroundColor: '#d1fae5',
    borderLeftColor: '#10b981',
  },
  ambiguousCard: {
    backgroundColor: '#fef3c7',
    borderLeftColor: '#f59e0b',
  },
  errorCard: {
    backgroundColor: '#fee2e2',
    borderLeftColor: '#ef4444',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  confidence: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 12,
  },
  addressDetails: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  addressLine: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  formattedAddress: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  coordinates: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginTop: 8,
  },
  details: {
    marginTop: 8,
    gap: 4,
  },
  detailItem: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
});