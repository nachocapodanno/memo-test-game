import { MemoTest } from '@/components/MemoTest';
import MemoTestsList from '@/components/MemoTestList';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 gap-16'>
      <h1 className='text-5xl font-bold'>Memo Test Game</h1>
      <div className='flex flex-wrap gap-4'>
        <MemoTestsList />
      </div>
    </main>
  );
}
