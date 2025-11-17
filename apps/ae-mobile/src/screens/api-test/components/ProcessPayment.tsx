import { View } from "react-native";
import { useState } from "react";
import ApiSection from "./ApiSection";
import AppInput from "@src/components/ui/AppInput";
import AppButton from "@src/components/ui/AppButton";
import { useVoiceStore } from "@src/state/voiceStore";
import { useProcessPayment } from "@src/api/voice-gateway";
import { PaymentMethod } from "@src/api/types/voice-gateway";
import { useTheme } from "@src/theme";
import { withSession } from "@src/utils/withSession";

export default function ProcessPayment() {
    const { spacing } = useTheme();

    const sessionId = useVoiceStore(s => s.session?.sessionId);

    const {
        payment,
        isProcessing,
        error,
        processPayment,
    } = useProcessPayment();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
        PaymentMethod.CARD
    );
    const [token, setToken] = useState("test-token-123");

    const handlePress = withSession(sessionId, (sid) => {

        const request = {
            paymentMethod,
            paymentDetails: token ? { token } : undefined,
        };

        processPayment({ sessionId: sid, request });
    });

    return (
        <ApiSection
            title="Process Payment"
            description="Attempts to process payment for the order."
            buttonLabel="Process Payment"
            loading={isProcessing}
            onPress={handlePress}
            responseCode={error?.response?.status ?? (payment ? 200 : null)}
            responseDescription={
                error?.response?.data?.message ??
                payment?.responseMessage ??
                null
            }
        >
            <View style={{ marginTop: spacing.md }}>

                <AppButton
                    title={`Payment Method: ${paymentMethod}`}
                    onPress={() =>
                        setPaymentMethod(
                            paymentMethod === PaymentMethod.CARD
                                ? PaymentMethod.WALLET
                                : PaymentMethod.CARD
                        )
                    }
                    style={{ marginBottom: spacing.md }}
                />

                <AppInput
                    label="Payment Token"
                    value={token}
                    onChangeText={setToken}
                />

            </View>
        </ApiSection>
    );
}
