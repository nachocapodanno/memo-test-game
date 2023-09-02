import { useState, useEffect } from 'react';

type GameSession = {
    id: number
    memoTestId: number
    retries: number
    numberOfPairs: number
    state: string
}

function useGameSessions() {
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);

  useEffect(() => {
    const gameSessions = localStorage.getItem('gameSessions')
    const storedGameSessions = gameSessions ? JSON.parse(gameSessions) : []
    setGameSessions(storedGameSessions);
  }, []);

  const addGameSession = (newGameSession: GameSession) => {
    setGameSessions((prevSessions) => {
      // Check if the game session already exists for the memo test
      const filteredSessions = prevSessions.filter(
        prev => prev.memoTestId !== newGameSession.memoTestId
      );
      return [...filteredSessions, newGameSession]
    });
  };

  const deleteGameSessionById = (sessionId: number) => {
    setGameSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    );
  };

  useEffect(() => {
    localStorage.setItem('gameSessions', JSON.stringify(gameSessions));
  }, [gameSessions]);

  return {
    gameSessions,
    addGameSession,
    deleteGameSessionById,
  };
}

export default useGameSessions;
