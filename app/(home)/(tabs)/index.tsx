import {Link, useRouter} from "expo-router";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {getLocalizedText} from "@/languages/languages";
import {SignOutButton} from "@/components/sign-out-button";
import {useSession} from "@/services/session/ctx";

export default function Index() {
    const router = useRouter();
    const {session, signOut} = useSession();

    const handleSignOut = () => {
        if (session) {
            signOut();
            router.dismissAll();
        } else {
            router.replace('/(auth)/sign-in');
        }
    }

    return (<View style={styles.container}>
        <View style={styles.link}>
            <SignOutButton signOut={!!session} onSignOut={handleSignOut}/>
        </View>

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
        <Link style={styles.link}
              href="/company" asChild>
            <TouchableOpacity style={styles.button}>
                <Ionicons name={'business'} size={24} color={'white'}/>
                <Text style={styles.buttonText}>{getLocalizedText('company')}</Text>
            </TouchableOpacity>
        </Link>
        <Link style={styles.link}
              href="/taxes" asChild>
            <TouchableOpacity style={styles.button}>
                <Ionicons name={'library'} size={24} color={'white'}/>
                <Text style={styles.buttonText}>{getLocalizedText('taxes')}</Text>
            </TouchableOpacity>
        </Link>

    </View>);
}

const styles = StyleSheet.create({
    container: {
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
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
        fontSize: 16,
    }
});