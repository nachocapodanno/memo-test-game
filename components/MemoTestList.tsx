'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { client } from '../lib/apollo/apollo-client';
import { useRouter } from 'next/navigation';
import useGameSessions from '@/hooks/useGameSession';

const LIST_MEMO_TESTS = gql`
  query memoTests {
    memoTests {
      data {
        id
        name
        images
      }
    }
  }
`;

const CREATE_GAME_SESSION = gql`
  mutation CreateGameSession($memoTestId: ID!) {
    createGameSession(memoTestId: $memoTestId) {
      id
      memoTestId
      state
      retries
      numberOfPairs
    }
  }
`;

function MemoTestsList() {
  const { loading, error, data } = useQuery(LIST_MEMO_TESTS, { client });
  const [createGameSession] = useMutation(CREATE_GAME_SESSION, { client });

  const { addGameSession, gameSessions } = useGameSessions();
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const memoTests = data.memoTests.data;

  const showContinueButton = (memoTestId: number) => {
    return gameSessions.some(
      (gameSession) => gameSession.memoTestId === memoTestId
    );
  };

  const handleStartSession = async (memoTestId: string) => {
    try {
      const { data } = await createGameSession({
        variables: { memoTestId },
      });

      //   console.log('Sesión de juego creada:', data.createGameSession);

      const { __typename, ...rest } = data.createGameSession;
      addGameSession(rest);
      router.push(`/memo/${memoTestId}`);
    } catch (error: any) {
      console.error('Error during game session creation:', error.message);
    }
  };

  return (
    <div>
      <ul>
        {memoTests.map((memoTest: any) => (
          <div
            key={memoTest.id}
            className='flex justify-between items-center gap-8 p-4'
          >
            <p className='text-2xl'>{memoTest.name}</p>
            <div className='flex gap-4 flex-end p-2'>
              <button
                onClick={() => handleStartSession(memoTest.id)}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded'
              >
                Start
              </button>
              {showContinueButton(memoTest.id) && (
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded'>
                  Continue
                </button>
              )}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default MemoTestsList;
