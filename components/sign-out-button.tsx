import {useAuth, useClerk} from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import {Button} from 'react-native'
import {getLocalizedText} from "@/languages/languages";
import {useRouter} from "expo-router";

export const SignOutButton = () => {
    const {signOut} = useClerk();
    const {isSignedIn} = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            if (isSignedIn){
                await signOut();
                await Linking.openURL(Linking.createURL('/'));
            } else {
                await Linking.openURL(Linking.createURL('/(auth)/sign-in'));
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    }

    return (
        <Button color={isSignedIn ? 'red' : 'blue'}
                title={getLocalizedText(isSignedIn ? 'sign-out' : 'sign-in')}
                onPress={handleSignOut}/>
    );
}