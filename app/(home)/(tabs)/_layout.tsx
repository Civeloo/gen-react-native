import {getLocalizedText} from '@/languages/languages';
import Ionicons from '@expo/vector-icons/Ionicons';
import {router, Tabs} from 'expo-router';
import React, {Suspense} from "react";
import {useSession} from "@/services/session/ctx";
import {DB_NAME, migrateDbIfNeeded} from '@/services/database/database';
import {BackButton} from "@/components/back-button";
import {SignOutButton} from "@/components/sign-out-button";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {SQLiteProvider} from "expo-sqlite";

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

    return (<>
        <Suspense fallback={<ActivityIndicator size="large"/>}>
            <SQLiteProvider databaseName={DB_NAME} onInit={migrateDbIfNeeded} useSuspense>
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
                        tabBarHideOnKeyboard: true
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
            </SQLiteProvider>
        </Suspense>
    </>);
}

const styles = StyleSheet.create({
    headerRight: {
        paddingRight: 10
    }
});