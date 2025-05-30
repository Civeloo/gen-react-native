import React, {useState} from 'react';
import {SignInForm} from "@/components/auth/sign-in-form";
import {Link, useRouter} from "expo-router";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {getLocalizedText} from "@/languages/languages";
import {BackButton} from "@/components/back-button";
import {useSession} from '@/services/session/ctx';

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false);
    const {errors, session, signIn} = useSession();
    const router = useRouter();

    const handleOnSave = async (data: { email: string, password: string }) => {
        const {email, password} = data;
        setIsLoading(true);
        signIn(email, password);
        setIsLoading(false);
        if (session) router.replace('/');
    }

    return (<View style={styles.container}>
        <BackButton onPress={() => router.replace('/')}/>
        <View style={styles.form}>
            <SignInForm onSave={handleOnSave}/>
            {errors &&
                <Text key={errors?.code} style={styles.errorText}>
                    {errors?.message}
                </Text>
            }
            {isLoading && <ActivityIndicator/>}
        </View>
        <View style={styles.questions}>
            <View style={styles.questionsRow}>
                <Text>{getLocalizedText('sign-up-question')}</Text>
                <Link href='/sign-up'>
                    <Text style={styles.questionsText}>{getLocalizedText('sign-up')}</Text>
                </Link>
            </View>
            <View style={styles.questionsRow}>
                <Text>{getLocalizedText('password_forgot')}</Text>
                <Link href='/forgot'>
                    <Text style={styles.questionsText}>{getLocalizedText('password_reset')}</Text>
                </Link>
            </View>
        </View>
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    form: {flex: 1},
    errorText: {
        color: "red",
        alignSelf: "center",
        textAlign: "center",
        maxWidth: 200,
    },
    questions: {
        gap: 10,
    },
    questionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
    },
    questionsText: {
        fontWeight: 'bold',
    }
});