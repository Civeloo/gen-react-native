import {Redirect, Stack} from 'expo-router';
import {getLocalizedText} from "@/languages/languages";
import {useSession} from "@/services/session/ctx";

export default function AuthLayout() {
    const {session} = useSession();

    if (session)
        return <Redirect href={'/'}/>;

    return (<Stack>
        <Stack.Screen name='sign-in' options={{headerShown: false}}/>
        <Stack.Screen name='sign-up' options={{headerShown: false}}/>
        <Stack.Screen
            name='forgot'
            options={{
                title: getLocalizedText('forgot'),
                headerShown: true
            }}/>
    </Stack>);
}