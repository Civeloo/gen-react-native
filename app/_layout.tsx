import { Redirect, Slot, usePathname } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SessionProvider } from '@/services/session/ctx';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

mobileAds()
    .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
        testDeviceIdentifiers: ['EMULATOR'],
    })
    .then(() => {
    });

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

const RootLayout = storybookEnabled ? require("@/.storybook").default
    : () => {

        const pathname = usePathname();
        if (pathname && pathname.includes('auth')) {
            return <Redirect href="/(auth)/sign-in" />;
        }

        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <SessionProvider>
                        <Slot />
                    </SessionProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        )
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RootLayout;
