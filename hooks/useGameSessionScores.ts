import { useState, useEffect } from 'react';
import { client } from '../lib/apollo/apollo-client';
import { GET_GAME_SESSION_BY_ID } from '@/graphql/queries/getGameSessionById';
import { getGameScore } from '@/utils/common';

type GameSessionScore = {
  memoTestId: number;
  gameSessionId: number;
  score: number
}

function useGameSessionsScores() {
  const [gameSessions, setGameSessions] = useState<GameSessionScore[]>(() => {
    const gameSessions = localStorage.getItem('gameScores');
    return gameSessions ? JSON.parse(gameSessions) : [];
  });

  const saveGameSessionHighestScore = async ({ memoTestId, gameSessionId }: { memoTestId: number, gameSessionId: number }) => {
    const newScore = await getGameSessionScore(gameSessionId);
    const currentScore = getGameSessionsHighestScore(memoTestId)

    if (newScore > currentScore) {
      setGameSessions((prevSessions) => {
        // Check if the game session already exists for the memo test
        const filteredSessions = prevSessions.filter(
          (prev) => prev.memoTestId !== memoTestId
        );
        return [...filteredSessions, { memoTestId, gameSessionId, score: newScore }];
      });
    }
  };

  const getGameSessionsHighestScore = (memoTestId: string | number) => {
    return gameSessions.find((session) => Number(session.memoTestId) === Number(memoTestId))?.score || 0;
  };

  const getGameSessionScore = async (gameSessionId: number) => {
    const { data } = await client.query({
      query: GET_GAME_SESSION_BY_ID,
      variables: { id: gameSessionId }
    });

    const { retries = 0, numberOfPairs = 0 } = data.gameSession;
    return getGameScore(numberOfPairs, retries);
  }

  useEffect(() => {
    localStorage.setItem('gameScores', JSON.stringify(gameSessions));
  }, [gameSessions]);

  return {
    gameSessions,
    saveGameSessionHighestScore,
    getGameSessionsHighestScore,
  };
}

export default useGameSessionsScores;
