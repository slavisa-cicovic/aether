import { PaymentMethod } from "@src/api/types/voice-gateway";
import { useConfirmOrder } from "@src/api/voice-gateway";
import AppButton from "@src/components/ui/AppButton";
import { useVoiceStore } from "@src/state/voiceStore";
import { useTheme } from "@src/theme";
import { useState } from "react";
import { View } from "react-native";
import ApiSection from "./ApiSection";
import { withSession } from "@src/utils/withSession";

export default function ConfirmOrder() {
    const { spacing } = useTheme();

    const sessionId = useVoiceStore(s => s.session?.sessionId);

    const {
        confirmation,
        isConfirming,
        error,
        confirmOrder,
    } = useConfirmOrder();

    const [userConfirmed, setUserConfirmed] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
        PaymentMethod.CARD
    );

    const handlePress = withSession(sessionId, (sid) => {

        const request = {
            userConfirmed,
            paymentMethod,
        };

        confirmOrder({ sessionId: sid, request });
    });

    return (
        <ApiSection
            title="Confirm Order"
            description="User confirms the order and selects a payment method."
            buttonLabel="Confirm Order"
            loading={isConfirming}
            onPress={handlePress}
            responseCode={error?.response?.status ?? (confirmation ? 200 : null)}
            responseDescription={
                error?.response?.data?.message ??
                confirmation?.responseMessage ??
                null
            }
        >
            <View style={{ marginTop: spacing.md }}>

                <AppButton
                    title={`User confirmed: ${userConfirmed}`}
                    onPress={() => setUserConfirmed(!userConfirmed)}
                    style={{ marginBottom: spacing.md }}
                />

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

            </View>
        </ApiSection>
    );
}
