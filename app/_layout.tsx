import {Slot} from "expo-router";
import {StyleSheet} from "react-native";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

function RootLayout() {

    return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Slot/>
                </SafeAreaView>
            </SafeAreaProvider>
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
