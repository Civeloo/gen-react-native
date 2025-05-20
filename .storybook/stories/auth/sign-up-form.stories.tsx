import {Meta, StoryObj} from '@storybook/react';
import {StyleSheet, View} from 'react-native';
import {SignUpForm} from "@/components/auth/sign-up-form";

const meta = {
    title: 'Sign Up Form',
    component: SignUpForm,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    borderWidth: 4,
                    borderColor: 'red',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Story/>
            </View>
        ),
    ],
} satisfies Meta<typeof SignUpForm>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Default: StoryType = {
    args: {
        onSave: (data) => {
            console.log('submitting', JSON.stringify(data));
        },
    },
};
