import { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { Card } from './Card';

const meta = {
  title: 'Card',
  component: Card,
  argTypes: {},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isFlipped: false,
    onClick: () => {},
    number: 1,
    imageUrl: 'https://via.placeholder.com/150',
  },
};

export const LoggedIn: Story = {
  args: {
    isFlipped: false,
    onClick: () => {},
    number: 1,
    imageUrl: 'https://via.placeholder.com/150',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await canvas.getByText(1);
    await userEvent.click(loginButton);
  },
};
