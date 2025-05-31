import {useRouter} from 'expo-router';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getLocalizedText} from '@/languages/languages';
import {useSession} from "@/services/session/ctx";
import {useEffect} from "react";

export default function HomePage() {
    const {session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) router.push('/(home)/(tabs)');
    }, [session]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getLocalizedText('CFBundleDisplayName')}</Text>
            <View style={styles.buttons}>
                <Button title={getLocalizedText('sign-in')} onPress={() => router.push('/(auth)/sign-in')}/>
                <TouchableOpacity onPress={() => router.push('/(home)/(tabs)')}>
                    <Text style={styles.skip}>{getLocalizedText('skip')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    title: {
        fontSize: 72,
        fontWeight: 'bold',
    },
    buttons: {
        gap: 20,
    },
    skip: {
        color: '#2196F3',
        textAlign: 'center',
        fontWeight: 'bold',
    }
});