import {Stack} from 'expo-router/stack';
import {useEffect} from 'react';
import {useSession} from "@/services/session/ctx";
import {ActivityIndicator} from "react-native";

export default function Layout() {
    const {authState, isLoading} = useSession();

    useEffect(() => {
        authState();
    }, []);

    return (
        isLoading ? <ActivityIndicator/>
            :
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            </Stack>
    );
}
