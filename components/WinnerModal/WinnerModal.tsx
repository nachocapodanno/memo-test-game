'use client';

import { GET_GAME_SESSION_BY_ID } from '@/graphql/queries/getGameSessionById';
import { client } from '../../lib/apollo/apollo-client';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { getGameScore } from '@/utils/common';
import { Modal } from '../Modal/Modal';
import { WinnerModalBody } from './WinnerModalBody';

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
    <Modal
      title='Congratulations! 🎉'
      body={<WinnerModalBody score={score} loading={loading} error={error} />}
      button={
        <Link href='/' type='button' className='btn btn-primary btn-sm'>
          Back to home
        </Link>
      }
    />
  );
}
