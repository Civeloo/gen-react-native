import {Button} from 'react-native'
import {getLocalizedText} from "@/languages/languages";

export const SignOutButton = ({signOut, onSignOut}:{signOut:boolean, onSignOut:()=>void}) => {
    const handleSignOut = async () => {
        onSignOut();
    }

    return (
        <Button color={signOut ? 'red' : 'blue'}
                title={getLocalizedText(signOut ? 'sign_out' : 'sign_in')}
                onPress={handleSignOut}/>
    );
}