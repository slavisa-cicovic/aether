import AppButton from '@src/components/ui/AppButton';
import AppText from '@src/components/ui/AppText';
import { View } from 'react-native';

export default function HomeView() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <AppText variant='h3' style={{ marginBottom: 20, textAlign: 'center' }}>
                AetherNet Delivery
            </AppText>

            <AppButton
                variant="primary"
                size="md"
                title="Call Aether Support"
                onPress={() => console.log("Calling...")}
            />
        </View>
    );
}
