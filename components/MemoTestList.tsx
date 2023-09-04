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
    return <span className='loading loading-spinner text-secondary'></span>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const memoTests = data.memoTests.data;

  const showContinueButton = (memoTestId: number) => {
    return gameSessions.some(
      (gameSession) =>
        gameSession.memoTestId === memoTestId && gameSession.cards.length > 0
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

  const getHighestScoreValue = (memoTestId: string) => {
    const score = getGameSessionsHighestScore(memoTestId);
    return score > 0 ? score : '-';
  };

  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 mt-12'>
      {memoTests.map((memoTest: any) => (
        <div
          key={memoTest.id}
          className='card w-96 bg-primary text-primary-content'
        >
          <div className='card-body'>
            <h2 className='card-title subpixel-antialiased text-2xl'>{memoTest.name}</h2>
            <div className='stat p-0'>
              <div className='flex items-center gap-2'>
                <p className='stat-title antialiased text-slate-300 grow-0'>
                  Highest Score
                </p>
                <span className='text-xl'>🏆</span>
              </div>
              <div className='stat-value'>
                {getHighestScoreValue(memoTest.id)}
              </div>
            </div>
            <div className='card-actions justify-end mt-4'>
              <button
                onClick={() => handleStartSession(memoTest.id)}
                className='btn btn-success'
              >
                Start
              </button>
              {showContinueButton(Number(memoTest.id)) && (
                <button
                  onClick={() => handleContinueSession(memoTest.id)}
                  className='btn btn-success'
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemoTestsList;
