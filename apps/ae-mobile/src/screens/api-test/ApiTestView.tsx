import { useHealthCheck } from "@src/api/voice-gateway";
import AppCard from "@src/components/ui/AppCard";
import { useTheme } from "@src/theme";
import { View } from "react-native";
import CalculateQuote from "./components/CalculateQuote";
import CancelOrder from "./components/CancelOrder";
import ConfirmOrder from "./components/ConfirmOrder";
import ProcessPayment from "./components/ProcessPayment";
import SessionCreate from "./components/SessionCreate";
import VerificationAddress from "./components/VerificationAddress";
import VerifyMerchant from "./components/VerifyMerchant";

export default function ApiTestView() {
    const { data, isLoading, error, refetch } = useHealthCheck({ detailed: true });
    const { colors } = useTheme();

    const status = isLoading
        ? "CHECKING..."
        : error
            ? "DOWN"
            : data?.status ?? "UNKNOWN";

    const timestamp = data?.timestamp;

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.surfaceVariant,
            }}
        >
            <AppCard style={{ flex: 1 }}>
                <AppCard.Header
                    title="Voice Gateway"
                    subtitle={timestamp ? `Last check at ${timestamp}` : "Health Check"}
                    loading={isLoading}
                    status={status}
                    icon="refresh"
                    onIconPress={() => refetch()}
                />

                <AppCard.Content scroll >
                    <SessionCreate />
                    <VerificationAddress />
                    <VerifyMerchant />
                    <CalculateQuote />
                    <ConfirmOrder />
                    <ProcessPayment />
                    <CancelOrder />
                </AppCard.Content>
            </AppCard>
        </View>
    );
}
