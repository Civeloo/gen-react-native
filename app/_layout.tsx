import {Slot} from "expo-router";
import {StyleSheet} from "react-native";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ClerkProvider} from '@clerk/clerk-expo';
import {tokenCache} from "@clerk/clerk-expo/token-cache";

function RootLayout() {
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
    if (!publishableKey) {
        throw new Error(
            'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
        )
    }

    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Slot/>
                </SafeAreaView>
            </SafeAreaProvider>
        </ClerkProvider>
    );
}

let AppEntryPoint = RootLayout;

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
if (storybookEnabled) {
    AppEntryPoint = require("@/.storybook").default;
}

// Styles for the app.
const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#fff',
        flex: 1,
    },
});

export default AppEntryPoint;
