import { Meta, StoryObj } from '@storybook/react';
import { NewProductForm } from '@/components/products/new-product-form';
import { View } from 'react-native';

const meta = {
  title: 'NewProductForm',
  component: NewProductForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ margin:'auto' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NewProductForm>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Default: StoryType = {
  args: {
    onSave: (data) => {
      console.log('submitting', JSON.stringify(data));
    },
  },
};
