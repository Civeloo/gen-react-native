import {Meta, StoryObj} from '@storybook/react';
import {ProductForm} from '@/components/products/product-form';
import {ScrollView} from 'react-native';

const meta = {
    title: 'ProductForm',
    component: ProductForm,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ScrollView style={{padding: 16, flex: 1,}} showsVerticalScrollIndicator={false}>
                <Story/>
            </ScrollView>
        ),
    ],
} satisfies Meta<typeof ProductForm>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Default: StoryType = {
    args: {
        onSave: (data) => {
            console.log('submitting', JSON.stringify(data));
        },
    },
};
