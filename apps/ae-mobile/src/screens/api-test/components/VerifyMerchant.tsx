// src/screens/api-test/components/VerifyMerchant.tsx

import { View } from "react-native";
import { useState } from "react";
import ApiSection from "./ApiSection";
import AppInput from "@src/components/ui/AppInput";
import AppButton from "@src/components/ui/AppButton";
import { useVerifyMerchant } from "@src/api/voice-gateway";
import { useTheme } from "@src/theme";
import { useVoiceStore } from "@src/state/voiceStore";
import { withSession } from "@src/utils/withSession";

export default function VerifyMerchant() {
    const { colors, spacing } = useTheme();

    const {
        verification,
        isVerifying,
        error,
        verifyMerchant,
    } = useVerifyMerchant();

    // -------------------------
    // FORM STATE
    // -------------------------
    const [merchantId, setMerchantId] = useState("m-123");
    const [merchantName, setMerchantName] = useState("Demo Merchant");

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

        verifyMerchant({
            sessionId: sid,
            request: {
                merchantId,
                merchantName,
                items,
            },
        })
    });


    return (
        <ApiSection
            title="Verify Merchant"
            description="Checks merchant availability and prepares order feasibility."
            buttonLabel={isVerifying ? "Verifying..." : "Verify Merchant"}
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
                    label="Merchant ID"
                    value={merchantId}
                    onChangeText={setMerchantId}
                />

                <AppInput
                    label="Merchant Name"
                    value={merchantName}
                    onChangeText={setMerchantName}
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
