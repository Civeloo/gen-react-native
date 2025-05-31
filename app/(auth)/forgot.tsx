import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useRouter} from 'expo-router'
import {ForgotForm, ForgotFormDataProps} from "@/components/auth/forgot-form";
import {useSession} from "@/services/session/ctx";

export default function ForgotPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {errors, reset} = useSession();

    const handleOnSave = async (data: ForgotFormDataProps) => {
        const {email} = data;
        setIsLoading(true);
        reset(email);
        setIsLoading(false);
        if (!errors)
            router.back();
    }

    return (<View style={styles.container}>
        <ForgotForm onSave={handleOnSave}/>
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