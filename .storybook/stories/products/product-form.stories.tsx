import { Meta, StoryObj } from '@storybook/react';
import { ProductForm } from '@/components/products/product-form';
import { View } from 'react-native';

const meta = {
  title: 'ProductForm',
  component: ProductForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ margin:'auto' }}>
        <Story />
      </View>
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
