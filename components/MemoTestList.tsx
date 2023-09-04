'use client';

import { useQuery } from '@apollo/client';
import { client } from '../lib/apollo/apollo-client';
import { useRouter } from 'next/navigation';
import useGameSessions from '@/hooks/useGameSession';
import { GET_ALL_MEMO_TESTS } from '@/graphql/queries/getAllMemoTests';
import useGameSessionsScores from '@/hooks/useGameSessionScores';

function MemoTestsList() {
  const { loading, error, data } = useQuery(GET_ALL_MEMO_TESTS, { client });

  const {
    createGameSession,
    getGameSessionByMemoTestId,
    saveGameSessionLocal,
    gameSessions,
  } = useGameSessions();
  const { getGameSessionsHighestScore } = useGameSessionsScores();
  
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
      const { id } = await createGameSession(Number(memoTestId));
      saveGameSessionLocal({
        gameSessionId: id,
        memoTestId: Number(memoTestId),
        cards: [],
      });
      router.push(`/memo/${memoTestId}?sessionId=${id}`);
    } catch (error: any) {
      console.error('Error during game session creation:', error.message);
    }
  };

  const handleContinueSession = async (memoTestId: string) => {
    const gameSession = getGameSessionByMemoTestId(Number(memoTestId));
    if (!gameSession) {
      return;
    }
    router.push(`/memo/${memoTestId}?sessionId=${gameSession.gameSessionId}`);
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
            <p className='text-2xl bold'>{getGameSessionsHighestScore(memoTest.id)}</p>
            <div className='flex gap-4 flex-end p-2'>
              <button
                onClick={() => handleStartSession(memoTest.id)}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded'
              >
                Start
              </button>
              {showContinueButton(Number(memoTest.id)) && (
                <button
                  onClick={() => handleContinueSession(memoTest.id)}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded'
                >
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
