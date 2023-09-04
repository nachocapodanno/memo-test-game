'use client';

import { GET_GAME_SESSION_BY_ID } from '@/graphql/queries/getGameSessionById';
import { client } from '../lib/apollo/apollo-client';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { getGameScore } from '@/utils/common';

export function WinnerModal({ gameSessionId }: { gameSessionId: number }) {
  const { loading, error, data } = useQuery(GET_GAME_SESSION_BY_ID, {
    variables: { id: gameSessionId },
    client,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { retries = 0, numberOfPairs = 0 } = data.gameSession;
  const score = getGameScore(numberOfPairs, retries);
  
  return (
    <div
      className='fixed z-10 inset-0 overflow-y-auto'
      role='dialog'
    >
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          aria-hidden='true'
        ></div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-neutral rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
          <div className='flex justify-center items-center'>
            <div className='text-center mt-2'>
              <h1
                className='text-lg leading-8 text-3xl'
                id='modal-title'
              >
                Congratulations! 🎉
              </h1>
              <div className='mt-6'>
                <p className='text-medium'>Your score is</p>
                <p className='font-bold text-4xl mt-2'>{score}</p>
              </div>
            </div>
          </div>
          <div className='mt-8'>
            <Link
              href='/'
              type='button'
              className='btn btn-primary btn-sm'
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
