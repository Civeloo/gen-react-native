import {Button} from 'react-native'
import {getLocalizedText} from "@/languages/languages";

export const SignOutButton = ({signOut, onSignOut}:{signOut:boolean, onSignOut:()=>{}}) => {
    const handleSignOut = async () => {
        onSignOut();
    }

    return (
        <Button color={signOut ? 'red' : 'blue'}
                title={getLocalizedText(signOut ? 'sign-out' : 'sign-in')}
                onPress={handleSignOut}/>
    );
}