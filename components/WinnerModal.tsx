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
      id='error-modal'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
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
        <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
          <div className='sm:flex sm:items-start'>
            <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
              <h3
                className='text-lg leading-6 font-medium text-gray-900'
                id='modal-title'
              >
                Congratulations! 🎉
              </h3>
              <div className='mt-2'>
                <p className='text-sm text-gray-500'>Your score is {score}</p>
              </div>
            </div>
          </div>
          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
            <Link
              href='/'
              type='button'
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Close
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
