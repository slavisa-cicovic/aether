import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@src/theme";
import { TouchableOpacity, View } from "react-native";
import AppText from "../ui/AppText";

interface AppBarProps {
    title: string;
    onNotify?: () => void;
    onLogout?: () => void;
}

export default function AppBar({ title, onNotify, onLogout }: AppBarProps) {

    const { colors, spacing } = useTheme();

    return (
        <View
            style={{
                paddingTop: 45,
                paddingHorizontal: spacing.lg,
                paddingBottom: spacing.md,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: colors.surface,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            }}
        >
            <AppText variant='h3'>{title}</AppText>

            <View style={{ flexDirection: "row", gap: spacing.lg }}>
                <TouchableOpacity onPress={onNotify}>
                    <Ionicons name="notifications-outline" size={26} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={26} color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
