import { FC } from "react";
import { Controller, useController, UseControllerProps, useFormContext } from "react-hook-form";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & UseControllerProps & {
    label?: string;
};

export const TextInputController: FC<Props> = (props) => {
    const {
        label,
        ...rest
    } = props;
    const ucp: UseControllerProps = props;
    const tip: TextInputProps = props;
    const { name, rules, defaultValue } = ucp;

    const { control, formState } = useFormContext();
    const { field } = useController({ name, control });

    const error = formState?.errors[ucp.name];
    const hasError = Boolean(error);
    const errorText = error ? String(error.message) : '';

    return (
        <View style={styles.container}>
            {label && (<Text style={styles.label}>{label}</Text>)}
            <View style={styles.input}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.textInput}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value || ''}
                            placeholderTextColor={'gray'}
                            {...rest}
                        />
                    )}
                    name={name}
                />
            </View>
            <View style={styles.error}>
                {hasError && (<Text style={styles.errorText}>{errorText}</Text>)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    label: {},
    input: {
        paddingHorizontal: 10,
        height: 30,
        borderRadius: 5,
        backgroundColor: 'silver',
    },
    textInput: {
        height: '100%',
    },
    error: {
        height: 20,
    },
    errorText: {
        color: 'red',
    },
});
