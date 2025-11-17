import { View } from "react-native";
import ApiSection from "./ApiSection";
import AppInput from "@src/components/ui/AppInput";
import { useState } from "react";
import { useCreateSession } from "@src/api/voice-gateway";
import { useVoiceStore } from "@src/state/voiceStore";

export default function SessionCreate() {
    const { session, isCreating, error, createSession } = useCreateSession();
    const setSession = useVoiceStore(s => s.setSession);

    // -----------------------------------------------------
    // DEFAULT FORM VALUES
    // -----------------------------------------------------
    const [callSid, setCallSid] = useState(`CA${Date.now()}`);
    const [userPhoneNumber, setUserPhoneNumber] = useState("+38064");
    const [language, setLanguage] = useState("sr-Latin");

    return (
        <ApiSection
            title="Create Session"
            description="Initializes a new voice session for the call."
            buttonLabel={isCreating ? "Creating..." : "Create Session"}
            loading={isCreating}
            onPress={() =>
                createSession({
                    callSid,
                    userPhoneNumber,
                    language,
                }).then((newSession) => {
                    if (newSession) {
                        setSession(newSession);
                    }
                })
            }
            responseCode={
                error?.response?.status ??
                (session ? 200 : null)
            }
            responseDescription={
                error?.response?.data?.message ??
                session?.welcomeMessage ??
                null
            }
        >
            {/* CHILDREN INSIDE ApiSection */}
            <View style={{ marginTop: 12 }}>
                <AppInput
                    label="Call SID"
                    value={callSid}
                    onChangeText={setCallSid}
                />

                <AppInput
                    label="User phone number"
                    value={userPhoneNumber}
                    onChangeText={setUserPhoneNumber}
                />

                <AppInput
                    label="Language"
                    value={language}
                    onChangeText={setLanguage}
                />
            </View>
        </ApiSection>
    );
}
