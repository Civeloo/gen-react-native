import {Slot} from "expo-router";
import {StyleSheet} from "react-native";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {SessionProvider} from '@/services/session/ctx';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

const RootLayout = storybookEnabled ? require("@/.storybook").default
    : () => (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <SessionProvider>
                <Slot/>
                </SessionProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RootLayout;