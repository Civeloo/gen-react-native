import * as Linking from 'expo-linking'
import {Button} from 'react-native'
import {getLocalizedText} from "@/languages/languages";
import {useRouter} from "expo-router";

export const SignOutButton = () => {
    const isSignedIn = true
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            if (isSignedIn){
                await Linking.openURL(Linking.createURL('/'));
            } else {
                await Linking.openURL(Linking.createURL('/(auth)/sign-in'));
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    }

    return (
        <Button color={isSignedIn ? 'red' : 'blue'}
                title={getLocalizedText(isSignedIn ? 'sign-out' : 'sign-in')}
                onPress={handleSignOut}/>
    );
}