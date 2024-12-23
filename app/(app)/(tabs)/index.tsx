import { useSession } from "@/services/session/ctx";
import { router } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function Index() {

    const { signOut } = useSession();

    const handleSignOut = () => {
        signOut();
        router.replace('/');
    }

    return (<View style={styles.container}>
        <Button title="Sign Out" onPress={handleSignOut} />
    </View>);
}

const styles = StyleSheet.create({
    container: {
        margin: 'auto',
        width: 50,
    },
});