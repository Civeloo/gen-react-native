import {getLocalizedText} from '@/languages/languages';
import Ionicons from '@expo/vector-icons/Ionicons';
import {router, Tabs} from 'expo-router';
import React, {useEffect, useRef} from "react";
import {useSession} from "@/services/session/ctx";
import {Provider, useCreateMergeableStore} from 'tinybase/ui-react';
import {customSynchronizer, db, useCustomPersister} from '@/services/database/database';
import {BackButton} from "@/components/back-button";
import {SignOutButton} from "@/components/sign-out-button";
import {StyleSheet, View} from "react-native";

export default function TabLayout() {
    const {session, signOut} = useSession();

    const handleSignOut = () => {
        if (session) {
            signOut();
            router.dismissAll();
        } else {
            router.replace('/(auth)/sign-in');
        }
    }

    const store = useCreateMergeableStore(() => db);
    useCustomPersister(store);

    const synchronizerRef = useRef<any>(null);

    useEffect(() => {
        const userId = session;

        const stopSync = (sync: { stopSync: () => void; } | null) => {
            if (sync) {
                sync.stopSync();
                sync = null;
                // console.info('🛑 Synchronizer stop');
            }
        }

        if (!userId) {
            stopSync(synchronizerRef.current);
            return;
        }

        customSynchronizer(store, synchronizerRef, userId).then();

        return () => {
            stopSync(synchronizerRef.current);
        };
    }, [session]);

    return (
        <Provider store={store}>
            <Tabs
                screenOptions={{
                    headerStyle: {
                        height: 50,
                    },
                    headerStatusBarHeight: 0,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    tabBarIconStyle: {
                        marginTop: 10,
                    },
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: getLocalizedText('index'),
                        tabBarIcon: ({color, focused}) => (
                            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24}/>
                        ),
                        headerRight: () => (<View style={styles.headerRight}>
                            <SignOutButton signOut={!!session} onSignOut={handleSignOut}/>
                        </View>),
                    }}
                />
                <Tabs.Screen
                    name="order"
                    options={{
                        title: getLocalizedText('orders'),
                        tabBarIcon: ({color, focused}) => (
                            <Ionicons name={focused ? 'apps' : 'apps-outline'} color={color} size={24}/>
                        ),
                        headerLeft: () => (
                            <BackButton onPress={() => router.back()}/>
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
                        headerLeft: () => (
                            <BackButton onPress={() => router.back()}/>
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
                        headerLeft: () => (
                            <BackButton onPress={() => router.back()}/>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="company"
                    options={{
                        title: getLocalizedText('company'),
                        tabBarIcon: ({color, focused}) => (
                            <Ionicons name={focused ? 'business' : 'business-outline'} color={color} size={24}/>
                        ),
                        headerLeft: () => (
                            <BackButton onPress={() => router.back()}/>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="taxes"
                    options={{
                        title: getLocalizedText('taxes'),
                        headerLeft: () => (
                            <BackButton onPress={() => router.back()}/>
                        ),
                        href: null
                    }}
                />
            </Tabs>
        </Provider>
    );
}

const styles = StyleSheet.create({
    headerRight: {
        paddingRight: 10
    }
});