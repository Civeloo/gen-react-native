import {Stack} from 'expo-router/stack';
import {useEffect, useRef} from 'react';
import {Provider, useCreateMergeableStore} from 'tinybase/ui-react';
import {customSynchronizer, db, useCustomPersister} from '@/services/database/database';

export default function Layout() {
    const userId = 'user?.id';

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

    return (
        <Provider store={store}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="index" options={{headerShown: false}}/>
            </Stack>
        </Provider>
    );
}
