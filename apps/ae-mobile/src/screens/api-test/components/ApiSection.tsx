import { useTheme } from "@src/theme";
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import AppText from "@src/components/ui/AppText";
import AppButton from "@src/components/ui/AppButton";
import { Ionicons } from "@expo/vector-icons";

interface ApiSectionProps {
    title: string;
    description?: string;
    buttonLabel?: string;
    onPress?: () => void;
    responseCode?: number | null;
    responseDescription?: string | null;
    children?: React.ReactNode;
    defaultCollapsed?: boolean;
    loading: boolean;
}

export default function ApiSection({
    title,
    description,
    buttonLabel = "Send",
    onPress,
    responseCode,
    responseDescription,
    children,
    defaultCollapsed = false,
    loading
}: ApiSectionProps) {
    const { colors, spacing } = useTheme();

    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    const borderColor = (() => {
        if (responseCode == null) return colors.border;
        if (responseCode >= 200 && responseCode < 300) return colors.success;
        if (responseCode >= 400 && responseCode < 500) return colors.error;
        if (responseCode >= 500) return colors.warning;
        return colors.border;
    })();

    return (
        <View
            style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: spacing.sm
            }}
        >
            <TouchableOpacity
                onPress={() => setCollapsed(!collapsed)}
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: colors.surfaceVariant,
                    padding: spacing.md,
                }}
            >
                <View style={{ flex: 1, paddingRight: spacing.lg }}>
                    <AppText variant="h3">{title}</AppText>
                    {description && (
                        <AppText
                            variant="caption"
                            style={{ color: colors.textSecondary }}
                        >
                            {description}
                        </AppText>
                    )}
                </View>

                <Ionicons
                    name={collapsed ? "chevron-forward" : "chevron-down"}
                    size={24}
                    color={colors.text}
                />
            </TouchableOpacity>


            {!collapsed && (
                <View style={{
                    padding: spacing.md,
                }}>
                    {children}
                    <AppButton
                        title={buttonLabel}
                        onPress={onPress ?? (() => { })}
                        disabled={loading}
                        style={{ marginTop: spacing.md }}
                    />
                    <View
                        style={{
                            marginTop: spacing.md,
                            padding: spacing.md,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor,
                            backgroundColor: colors.surface,
                        }}
                    >
                        <AppText variant="bodyMedium">
                            Response Code: {responseCode}
                        </AppText>

                        {responseDescription && (
                            <AppText variant="body" style={{ marginTop: spacing.xs }}>
                                {responseDescription}
                            </AppText>
                        )}
                    </View>

                </View>
            )}
        </View>
    );
}
