import {Stack} from 'expo-router/stack';
import {useEffect, useRef} from 'react';
import {Provider, useCreateMergeableStore} from 'tinybase/ui-react';
import {customSynchronizer, db, useCustomPersister} from '@/services/database/database';
import {useSession} from "@/services/session/ctx";
import {ActivityIndicator} from "react-native";

export default function Layout() {
    const {authState, session, isLoading} = useSession();
    const userId = session;

    const store = useCreateMergeableStore(() => db);
    useCustomPersister(store);

    const synchronizerRef = useRef<any>(null);

    useEffect(() => {
        if (!userId) {
            // If user logs out, stop and clean the previous synchronizer
            if (synchronizerRef.current) {
                synchronizerRef.current.stop?.();
                synchronizerRef.current = null;
            }
            return;
        }
        customSynchronizer(store, synchronizerRef, userId);
        return () => {
            if (synchronizerRef.current) {
                synchronizerRef.current.stop?.();
                synchronizerRef.current = null;
            }
        };
    }, [userId]);

    useEffect(() => {
        authState();
    }, []);

    return (
        isLoading ? <ActivityIndicator/>
            :
            <Provider store={store}>
                <Stack>
                    {/*<Stack.Protected guard={!session}>*/}
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                    {/*</Stack.Protected>*/}
                    {/*<Stack.Protected guard={!!session}>*/}
                        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    {/*</Stack.Protected>*/}
                </Stack>
            </Provider>
    );
}
