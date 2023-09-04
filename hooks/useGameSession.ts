import { useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { client } from '../lib/apollo/apollo-client';
import { UPDATE_GAME_SESSION_RETRIES } from '@/graphql/mutations/updateGameSessionRetries';
import { CREATE_GAME_SESSION } from '@/graphql/mutations/createGameSession';
import { END_GAME_SESSION } from '@/graphql/mutations/endGameSession';

function useGameSessions() {
  const [gameSessions, setGameSessions] = useState<GameSession[]>(() => {
    if (typeof window !== 'undefined') {
      const gameSessions = localStorage.getItem('gameSessions');
      return gameSessions ? JSON.parse(gameSessions) : [];
    }
    return [];
  });

  const [createGameSessionMutation] = useMutation(CREATE_GAME_SESSION, {
    client,
  });
  const [updateGameSessionRetries] = useMutation(UPDATE_GAME_SESSION_RETRIES, {
    client,
  });
  const [endGameSession] = useMutation(END_GAME_SESSION, {
    client,
  });

  const saveGameSessionLocal = (newGameSession: GameSession) => {
    setGameSessions((prevSessions) => {
      // Check if the game session already exists for the memo test
      const filteredSessions = prevSessions.filter(
        (prev) => prev.memoTestId !== newGameSession.memoTestId
      );
      return [...filteredSessions, newGameSession];
    });
  };

  const deleteGameSessionLocalById = (gameSessionId: number) => {
    setGameSessions((prevSessions) => {
      return prevSessions.filter(
        (prev) => prev.gameSessionId !== gameSessionId
      );
    });
  };

  const createGameSession = async (memoTestId: number) => {
    try {
      const { data } = await createGameSessionMutation({
        variables: { memoTestId },
      });
      return data.createGameSession;
    } catch (error: any) {
      console.error('Error during game session creation:', error.message);
    }
  };

  const updateGameSessionById = async (gameSessionId: number) => {
    try {
      await updateGameSessionRetries({
        variables: { id: gameSessionId, retries: 1 },
      });
    } catch (error: any) {
      console.error('Error during game session retries update:', error.message);
    }
  };

  const endGameSessionById = async (gameSessionId: number) => {
    try {
      await endGameSession({
        variables: { id: gameSessionId },
      });
    } catch (error: any) {
      console.error('Error during game session end:', error.message);
    }
  };

  const getGameSessionByMemoTestId = (memoTestId: number) => {
    return gameSessions.find((session) => session.memoTestId === memoTestId);
  };

  useEffect(() => {
    localStorage.setItem('gameSessions', JSON.stringify(gameSessions));
  }, [gameSessions]);

  return {
    gameSessions,
    saveGameSessionLocal,
    getGameSessionByMemoTestId,
    deleteGameSessionLocalById,
    updateGameSessionById,
    createGameSession,
    endGameSessionById,
  };
}

export default useGameSessions;
