import { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';

const meta = {
  title: 'Modal',
  component: Modal,
  argTypes: {
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = (
  <p>Your score is 100</p>
);

export const Primary: Story = {
  args: {
    title: 'Default Title',
    body,
    button: <button className='btn btn-success btn-sm'>Continue</button>,
  },
};
