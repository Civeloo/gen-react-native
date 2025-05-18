import {Meta, StoryObj} from '@storybook/react';
import {StyleSheet, View} from 'react-native';
import {SignInForm} from "@/components/sign-in/sign-in-form";

const meta = {
    title: 'Sign In Form',
    component: SignInForm,
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
} satisfies Meta<typeof SignInForm>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Default: StoryType = {
    args: {
        onSave: (data) => {
            console.log('submitting', JSON.stringify(data));
        },
    },
};
