import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import {getLocalizedText} from "@/languages/languages";

export default function AuthRoutesLayout() {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Redirect href={'/'} />;
    }

    return (<Stack>
        <Stack.Screen name='sign-in' options={{headerShown: false}}/>
        <Stack.Screen name='sign-up' options={{
            title: getLocalizedText('sign-up'),
            headerShown: true}}/>
        <Stack.Screen name='forgot' options={{
            title: getLocalizedText('forgot'),
            headerShown: true}}/>
    </Stack>);
}