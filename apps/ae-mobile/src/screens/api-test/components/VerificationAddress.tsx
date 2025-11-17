// src/screens/api-test/components/VerificationAddress.tsx

import { View } from "react-native";
import ApiSection from "./ApiSection";
import { useVerifyAddress } from "@src/api/voice-gateway";
import { useVoiceStore } from "@src/state/voiceStore";
import { withSession } from "@src/utils/withSession";
import { useState } from "react";
import AppInput from "@src/components/ui/AppInput";
import { useTheme } from "@src/theme";

export default function VerificationAddress() {
    const {
        verification,
        isVerifying,
        error,
        verifyAddress,
    } = useVerifyAddress();

    const { spacing } = useTheme();

    const sessionId = useVoiceStore(s => s.session?.sessionId);

    const [spokenAddress, setSpokenAddress] = useState("Marsala Tolstoja 44, Beograd");

    const handlePress = withSession(sessionId, (sid) => {

        verifyAddress({
            sessionId: sid,
            request: {
                spokenAddress,
            },
        });
    });

    return (

        <ApiSection
            title="Verify address"
            description="Verifies and geocodes the address spoken by the user during the call."
            buttonLabel="Verify Address"
            loading={isVerifying}
            onPress={handlePress}
            responseCode={
                error?.response?.status ??
                (verification ? 200 : null)
            }
            responseDescription={
                error?.response?.data?.message ??
                verification?.responseMessage ??
                null
            }
        >
            <View style={{ marginTop: spacing.md }}>
                <AppInput
                    label="Spoken Address"
                    value={spokenAddress}
                    onChangeText={setSpokenAddress}
                />
            </View>
        </ApiSection>
    );
}
