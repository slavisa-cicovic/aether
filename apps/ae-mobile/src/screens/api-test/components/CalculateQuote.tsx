import { View } from "react-native";
import { useState } from "react";
import ApiSection from "./ApiSection";
import AppInput from "@src/components/ui/AppInput";
import AppButton from "@src/components/ui/AppButton";
import { useCalculateQuote } from "@src/api/voice-gateway";
import { useTheme } from "@src/theme";
import { DeliveryTimeType } from "@src/api/types/voice-gateway";
import { useVoiceStore } from "@src/state/voiceStore";
import { withSession } from "@src/utils/withSession";

export default function CalculateQuote() {
    const { spacing, colors } = useTheme();

    const sessionId = useVoiceStore(s => s.session?.sessionId);

    const {
        quote,
        isVerifying,
        error,
        calculateQuote,
    } = useCalculateQuote();

    // -------------------------
    // FORM STATE
    // -------------------------
    const [deliveryTimeType, setDeliveryTimeType] = useState<DeliveryTimeType>(
        DeliveryTimeType.NOW
    );

    const [scheduledTime, setScheduledTime] = useState(
        new Date(Date.now() + 60 * 60 * 1000).toISOString() // +1h default
    );

    const handlePress = withSession(sessionId, (sid) => {
        const request = {
            deliveryTimeType,
            scheduledTime: deliveryTimeType === DeliveryTimeType.SCHEDULED
                ? scheduledTime
                : undefined,
        };
        calculateQuote({
            sessionId: sid,
            request,
        });
    });

    return (
        <ApiSection
            title="Calculate Quote"
            description="Estimates delivery time and cost breakdown."
            buttonLabel="Calculate Quote"
            loading={isVerifying}
            onPress={handlePress}
            responseCode={
                error?.response?.status ?? (quote ? 200 : null)
            }
            responseDescription={
                error?.response?.data?.message ??
                quote?.responseMessage ??
                null
            }
        >
            <View style={{ marginTop: spacing.md }}>

                {/* DELIVERY TIME TYPE */}
                <AppButton
                    title={`Type: ${deliveryTimeType}`}
                    onPress={() =>
                        setDeliveryTimeType(
                            deliveryTimeType === DeliveryTimeType.NOW
                                ? DeliveryTimeType.SCHEDULED
                                : DeliveryTimeType.NOW
                        )
                    }
                    style={{ marginBottom: spacing.md }}
                />

                {/* SHOW SCHEDULED TIME ONLY IF USER SELECTED IT */}
                {deliveryTimeType === DeliveryTimeType.SCHEDULED && (
                    <AppInput
                        label="Scheduled Time (ISO)"
                        value={scheduledTime}
                        onChangeText={setScheduledTime}
                    />
                )}

            </View>

            {/* If quote available, show breakdown */}
            {quote && (
                <View
                    style={{
                        marginTop: spacing.lg,
                        padding: spacing.md,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                    }}
                >
                    <AppInput
                        label="Currency"
                        value={quote.currency}
                        onChangeText={() => { }}
                    />

                    <AppInput
                        label={`Items Total: ${quote.breakdown.itemsTotal}`}
                        value={String(quote.breakdown.itemsTotal)}
                        onChangeText={() => { }}
                    />

                    <AppInput
                        label={`Delivery Fee: ${quote.breakdown.deliveryFee}`}
                        value={String(quote.breakdown.deliveryFee)}
                        onChangeText={() => { }}
                    />

                    <AppInput
                        label={`Total: ${quote.breakdown.total}`}
                        value={String(quote.breakdown.total)}
                        onChangeText={() => { }}
                    />

                    {quote.estimatedDeliveryMinutes != null && (
                        <AppInput
                            label="Estimated Delivery Minutes"
                            value={String(quote.estimatedDeliveryMinutes)}
                            onChangeText={() => { }}
                        />
                    )}
                </View>
            )}
        </ApiSection>
    );
}
