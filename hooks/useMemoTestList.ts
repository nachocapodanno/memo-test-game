import { GameState } from '@/constants/enums';
import useGameSessions from './useGameSession';
import useGameSessionsScores from './useGameSessionScores';
import { useRouter } from 'next/navigation';

export const useMemoTestList = () => {
  const router = useRouter();

  const {
    createGameSession,
    getGameSessionByMemoTestId,
    gameSessions,
    saveGameSessionLocal,
  } = useGameSessions();
  const { getGameSessionsHighestScore } = useGameSessionsScores();

  const handleStartSession = async (memoTestId: string) => {
    try {
      const { id } = await createGameSession(Number(memoTestId));
      saveGameSessionLocal({
        memoTestId: Number(memoTestId),
        gameSessionId: id,
        cards: [],
      });
      router.push(`/memo/${memoTestId}?sessionId=${id}&state=${GameState.NEW}`);
    } catch (error: any) {
      console.error('Error during game session creation:', error.message);
    }
  };

  const handleContinueSession = async (memoTestId: string) => {
    const gameSession = getGameSessionByMemoTestId(Number(memoTestId));
    if (!gameSession) {
      return;
    }
    router.push(
      `/memo/${memoTestId}?sessionId=${gameSession.gameSessionId}&state=${GameState.STARTED}`
    );
  };

  const showContinueButton = (memoTestId: number) => {
    return gameSessions.some(
      (gameSession) =>
        gameSession.memoTestId === memoTestId && gameSession.cards.length > 0
    );
  };

  const getHighestScoreValue = (memoTestId: string) => {
    const score = getGameSessionsHighestScore(memoTestId);
    return score > 0 ? score : '-';
  };

  return {
    handleStartSession,
    handleContinueSession,
    showContinueButton,
    getHighestScoreValue,
  };
};
