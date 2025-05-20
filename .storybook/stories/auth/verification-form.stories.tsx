import {Meta, StoryObj} from '@storybook/react';
import {StyleSheet, View} from 'react-native';
import {VerificationForm} from "@/components/auth/verification-form";

const meta = {
    title: 'Verification Form',
    component: VerificationForm,
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
} satisfies Meta<typeof VerificationForm>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Default: StoryType = {
    args: {
        onSave: (data) => {
            console.log('submitting', JSON.stringify(data));
        },
    },
};
