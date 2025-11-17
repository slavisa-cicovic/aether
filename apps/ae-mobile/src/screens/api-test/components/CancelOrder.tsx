import { CancelReason } from "@src/api/types/voice-gateway";
import { useCancelOrder } from "@src/api/voice-gateway";
import AppButton from "@src/components/ui/AppButton";
import AppInput from "@src/components/ui/AppInput";
import { useVoiceStore } from "@src/state/voiceStore";
import { useTheme } from "@src/theme";
import { useState } from "react";
import { View } from "react-native";
import ApiSection from "./ApiSection";
import { withSession } from "@src/utils/withSession";

const cancelReasons = Object.values(CancelReason);

export default function CancelOrder() {
    const { spacing } = useTheme();

    const sessionId = useVoiceStore(s => s.session?.sessionId);

    const {
        cancellation,
        isCancelling,
        error,
        cancelOrder,
    } = useCancelOrder();

    const [reason, setReason] = useState<CancelReason>(
        CancelReason.USER_CANCELLED
    );
    const [description, setDescription] = useState("Changed my mind");

    const cycleReason = () => {
        const index = cancelReasons.indexOf(reason);
        const next = (index + 1) % cancelReasons.length;
        setReason(cancelReasons[next] as CancelReason);
    };

    const handlePress = withSession(sessionId, (sid) => {

        const request = {
            reason,
            description,
        };

        cancelOrder({ sessionId: sid, request });
    });

    return (
        <ApiSection
            title="Cancel Order"
            description="Cancels the current order with a reason."
            buttonLabel="Cancel Order"
            loading={isCancelling}
            onPress={handlePress}
            responseCode={error?.response?.status ?? (cancellation ? 200 : null)}
            responseDescription={
                error?.response?.data?.message ??
                cancellation?.message ??
                null
            }
        >
            <View style={{ marginTop: spacing.md }}>

                <AppButton
                    title={`Reason: ${reason}`}
                    onPress={cycleReason}
                    style={{ marginBottom: spacing.md }}
                />

                <AppInput
                    label="Description (optional)"
                    value={description}
                    onChangeText={setDescription}
                />

            </View>
        </ApiSection>
    );
}
