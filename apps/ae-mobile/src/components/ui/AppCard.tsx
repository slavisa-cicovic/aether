import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@src/theme";
import { ActivityIndicator, ScrollView, TouchableOpacity, View, ViewStyle } from "react-native";
import AppText from "./AppText";

interface AppCardProps {
    children: React.ReactNode;
    style?: any;
}

function CardContainer({ children, style }: AppCardProps) {
    const { colors, spacing } = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.surface,
                    padding: spacing.sm,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

// --------------------------------------
// HEADER
// --------------------------------------

interface HeaderProps {
    title: string;
    subtitle?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onIconPress?: () => void;
    loading?: boolean;
    status?: string;
}

function CardHeader({
    title,
    subtitle,
    icon,
    onIconPress,
    loading,
    status,
}: HeaderProps) {
    const { spacing, colors } = useTheme();

    return (
        <View
            style={{
                padding: spacing.sm,
                marginBottom: spacing.md,
                backgroundColor: colors.surfaceVariant ?? "#f5f5f5",
                borderRadius: 8,

                // shadow / elevation
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 1,

                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {/* LEFT SIDE */}
            <View>
                <AppText
                    variant="h2"
                    style={{
                        color: colors.text,
                    }}
                >
                    {title}
                </AppText>

                {subtitle && (
                    <AppText
                        variant="body"
                        style={{ color: colors.textSecondary, marginTop: 2 }}
                    >
                        {subtitle}
                    </AppText>
                )}

                {status && (
                    <AppText
                        variant="bodyBold"
                        style={{
                            marginTop: 4,
                            color:
                                status === "UP"
                                    ? colors.success
                                    : status === "DOWN"
                                        ? colors.error
                                        : colors.warning,
                        }}
                    >
                        {status}
                    </AppText>
                )}
            </View>

            {/* RIGHT SIDE */}
            {loading ? (
                <ActivityIndicator color={colors.text} />
            ) : icon ? (
                <TouchableOpacity onPress={onIconPress}>
                    <Ionicons name={icon} size={28} color={colors.text} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

// --------------------------------------
// CONTENT
// --------------------------------------

function CardContent({
    children,
    scroll,
    contentContainerStyle,
}: {
    children: React.ReactNode,
    scroll?: boolean;
    contentContainerStyle?: ViewStyle | ViewStyle[];
}) {
    const { spacing } = useTheme();

    if (scroll) {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[
                        { paddingBottom: spacing.md },
                        contentContainerStyle,
                    ]}
                >
                    {children}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={{ marginBottom: spacing.md }}>
            {children}
        </View>
    );
}

// --------------------------------------
// ACTIONS
// --------------------------------------

interface ActionsProps {
    label?: string;
    statusText?: string;
    onPress?: () => void;
}

function CardActions({ label, statusText, onPress }: ActionsProps) {
    const { colors, spacing } = useTheme();

    return (
        <View
            style={{
                marginTop: spacing.sm,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 4,
            }}
        >
            <AppText variant="bodyBold" style={{ color: colors.textSecondary }}>
                {statusText}
            </AppText>

            {label && (
                <TouchableOpacity onPress={onPress}>
                    <AppText
                        variant="bodyBold"
                        style={{ color: colors.primary, textDecorationLine: "underline" }}
                    >
                        {label}
                    </AppText>
                </TouchableOpacity>
            )}
        </View>
    );
}

// --------------------------------------
// EXPORT SA SLOTOVIMA
// --------------------------------------

const AppCard = Object.assign(CardContainer, {
    Header: CardHeader,
    Content: CardContent,
    Actions: CardActions,
});

export default AppCard;
