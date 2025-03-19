import {useSession} from "@/services/session/ctx";
import {router} from "expo-router";
import {Button, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Link} from 'expo-router';
import {getLocalizedText} from "@/languages/languages";

export default function Index() {

    const {signOut} = useSession();

    const handleSignOut = () => {
        signOut();
        router.replace('/');
    }

    return (<View style={styles.container}>
        <Link style={styles.link}
              href="/customer" asChild>
            <TouchableOpacity style={styles.button}>
                <Ionicons name={'person'} size={24} color={'white'}/>
                <Text style={styles.buttonText}>{getLocalizedText('customers')}</Text>
            </TouchableOpacity>
        </Link>
        <Link style={styles.link}
              href="/product" asChild>
            <TouchableOpacity style={styles.button}>
                <Ionicons name={'add-circle'} size={24} color={'white'}/>
                <Text style={styles.buttonText}>{getLocalizedText('products')}</Text>
            </TouchableOpacity>
        </Link>
        <Link style={styles.link}
              href="/order" asChild>
            <TouchableOpacity style={styles.button}>
                <Ionicons name={'apps'} size={24} color={'white'}/>
                <Text style={styles.buttonText}>{getLocalizedText('orders')}</Text>
            </TouchableOpacity>
        </Link>
        <View style={styles.link}>
            <Button title={getLocalizedText('sign-out')} onPress={handleSignOut}/>
        </View>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        margin: 'auto',
    },
    link: {
        margin: 10,
        width: 100,
        height: 100,
    },
    button: {
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        color: 'white',
    }
});