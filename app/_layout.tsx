import {db, TITLE_VALUES, useAndStartPersister} from "@/services/database/database";
import * as Crypto from 'expo-crypto';
import {Slot} from "expo-router";
import {StyleSheet, Text, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Provider, useCreateStore} from "tinybase/ui-react";
import {ClerkProvider} from '@clerk/clerk-expo';
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {useEffect, useState} from "react";

function RootLayout() {
    const [isLoading, setIsLoading] = useState(true);

    const IsLoading = () =>
        <View style={{margin: 'auto'}}>
            <Text style={{textAlign: 'center'}}>Loading...</Text>
        </View>;

    // Initialize the (memoized) TinyBase store and persist it.
    const store = useCreateStore(() => db);
    useAndStartPersister(store);
    const projectId = Crypto.randomUUID();
    store.setValue('currentProject', projectId)
    // store.setValue(TITLE_VALUES, 'GeN');

    useEffect(() => {
        if (!!store) setIsLoading(false);
    }, [store]);

    return (
        <ClerkProvider tokenCache={tokenCache}>
            <Provider store={store}>
                <SafeAreaProvider>
                    <SafeAreaView style={styles.container}>
                        {isLoading
                            ?
                            <IsLoading/>
                            :
                            <Slot/>
                        }
                    </SafeAreaView>
                </SafeAreaProvider>
            </Provider>
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
        backgroundColor: '#fff',
        flex: 1,
    },
});

export default AppEntryPoint;
