// src/screens/api-test/components/VerifyProvider.tsx

import { View } from "react-native";
import { useState } from "react";
import ApiSection from "./ApiSection";
import AppInput from "@src/components/ui/AppInput";
import AppButton from "@src/components/ui/AppButton";
import { useVerifyProvider } from "@src/api/voice-gateway";
import { useTheme } from "@src/theme";
import { useVoiceStore } from "@src/state/voiceStore";
import { withSession } from "@src/utils/withSession";

export default function VerifyProvider() {
    const { colors, spacing } = useTheme();

    const {
        verification,
        isVerifying,
        error,
        verifyProvider,
    } = useVerifyProvider();

    // -------------------------
    // FORM STATE
    // -------------------------
    const [providerId, setProviderId] = useState("p-123");
    const [providerName, setProviderName] = useState("Demo Provider");

    // Items array
    const [items, setItems] = useState([
        { name: "Coffee", quantity: 1 },
    ]);

    const addItem = () => {
        setItems([...items, { name: "", quantity: 1 }]);
    };

    const updateItem = (index: number, key: "name" | "quantity", value: string) => {
        const updated = [...items];
        updated[index] = {
            ...updated[index],
            [key]: key === "quantity" ? Number(value) : value,
        };
        setItems(updated);
    };

    const sessionId = useVoiceStore(s => s.session?.sessionId);

    const handlePress = withSession(sessionId, (sid) => {

        verifyProvider({
            sessionId: sid,
            request: {
                providerId,
                providerName,
                items,
            },
        })
    });


    return (
        <ApiSection
            title="Verify Provider"
            description="Checks provider availability and prepares order feasibility."
            buttonLabel={isVerifying ? "Verifying..." : "Verify Provider"}
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
                    label="Provider ID"
                    value={providerId}
                    onChangeText={setProviderId}
                />

                <AppInput
                    label="Provider Name"
                    value={providerName}
                    onChangeText={setProviderName}
                />

                {/* Items section */}
                <View style={{ marginTop: spacing.md }}>
                    <AppButton
                        title="Add Item"
                        onPress={addItem}
                        style={{ marginBottom: spacing.sm }}
                    />

                    {items.map((item, i) => (
                        <View
                            key={i}
                            style={{
                                marginBottom: spacing.md,
                                padding: spacing.sm,
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 6,
                            }}
                        >
                            <AppInput
                                label={`Item ${i + 1} Name`}
                                value={item.name}
                                onChangeText={(v) => updateItem(i, "name", v)}
                            />

                            <AppInput
                                label={`Item ${i + 1} Quantity`}
                                value={String(item.quantity)}
                                onChangeText={(v) => updateItem(i, "quantity", v)}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </ApiSection>
    );
}
