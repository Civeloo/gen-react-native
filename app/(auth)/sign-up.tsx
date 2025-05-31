import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useRouter} from 'expo-router';
import {SignUpForm, SignUpFormDataProps} from "@/components/auth/sign-up-form";
import {useSession} from '@/services/session/ctx';
import {BackButton} from "@/components/back-button";

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {errors, signUp} = useSession();

    const handleOnSave = async (data: SignUpFormDataProps) => {
        const {email, password} = data;
        setIsLoading(true);
        signUp(email, password);
        setIsLoading(false);
        if (!errors)
            router.back();
    }

    return (<View style={styles.container}>
        <BackButton onPress={() => router.back()}/>
        <SignUpForm onSave={handleOnSave}/>
        {errors &&
            <Text key={errors?.code} style={styles.errorText}>
                {errors?.message}
            </Text>
        }
        {isLoading && <ActivityIndicator/>}
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    errorText: {
        color: "red",
        alignSelf: "center",
        textAlign: "center",
        maxWidth: 200,
    },
});