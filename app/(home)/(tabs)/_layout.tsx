import {getLocalizedText} from '@/languages/languages';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Tabs} from 'expo-router';
import {useEffect, useRef} from "react";
import {useSession} from "@/services/session/ctx";
import {Provider, useCreateMergeableStore} from 'tinybase/ui-react';
import {customSynchronizer, db, useCustomPersister} from '@/services/database/database';

export default function TabLayout() {
    const {session} = useSession();

    const store = useCreateMergeableStore(() => db);
    useCustomPersister(store);

    const synchronizerRef = useRef<any>(null);

    useEffect(() => {
        const userId = session;

        const stopSync = (sync: { stopSync: () => void; } | null) =>{
            if (sync) {
                sync.stopSync();
                sync = null;
                console.log('🛑 Synchronizer stop');
            }
        }

        if (!userId) {
            stopSync(synchronizerRef.current);
            return;
        }

        customSynchronizer(store, synchronizerRef, userId);

        return () => {
            stopSync(synchronizerRef.current);
        };
    }, [session]);

    return (
        <Provider store={store}>
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: getLocalizedText('index'),
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="order"
                options={{
                    title: getLocalizedText('orders'),
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'apps' : 'apps-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="product"
                options={{
                    title: getLocalizedText('products'),
                    href: "/product?refresh=true",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="customer"
                options={{
                    title: getLocalizedText('customers'),
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="company"
                options={{
                    title: getLocalizedText('company'),
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24}/>
                    ),
                }}
            />
        </Tabs>
        </Provider>
    );
}
