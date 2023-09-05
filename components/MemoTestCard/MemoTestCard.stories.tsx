import { Meta, StoryObj } from '@storybook/react';
import { MemoTestCard } from './MemoTestCard';

const meta = {
  title: 'MemoTestCard',
  component: MemoTestCard,
  argTypes: {
  },
} satisfies Meta<typeof MemoTestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = (
  <>
    <div className='flex items-center gap-2'>
      <p className='stat-title antialiased text-slate-300 grow-0'>
        Highest Score
      </p>
      <span className='text-xl'>🏆</span>
    </div>
    <div className='stat-value'>100</div>
  </>
);

export const Primary: Story = {
  args: {
    title: 'Default Title',
    body,
    onStartSession: () => {},
  },
};

export const WithContinueButton = {
  args: {
    title: 'Title with Continue Button',
    body,
    onStartSession: () => {},
    onContinueSession: () => {},
    showContinueButton: true,
  },
};
