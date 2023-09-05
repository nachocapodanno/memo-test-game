import { useEffect, useState } from 'react';
import useGameSessions from './useGameSession';
import useGameSessionsScores from './useGameSessionScores';
import { GameState } from '@/constants/enums';
import { shuffleArray } from '@/utils/common';
import confetti from 'canvas-confetti';
import { GET_MEMO_TEST } from '@/graphql/queries/getMemoTest';
import { client } from '@/lib/apollo/apollo-client';
import { useQuery } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';

export const useMemoTest = (memoTestId: number) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameSessionId = Number(searchParams.get('sessionId'));
  const sessionState = searchParams.get('state');

  const { loading, error, data } = useQuery(GET_MEMO_TEST, {
    variables: { id: memoTestId },
    client,
  });

  const {
    updateGameSessionById,
    saveGameSessionLocal,
    getGameSessionByMemoTestId,
    deleteGameSessionLocalById,
    endGameSessionById,
  } = useGameSessions();

  const { saveGameSessionHighestScore } = useGameSessionsScores();

  const [cards, setCards] = useState<Card[]>(() => {
    const gameSession = getGameSessionByMemoTestId(Number(memoTestId));

    if (!gameSession) return [];

    if (GameState.NEW && gameSession.cards.length === 0) return [];

    // Started sessions or New sessions with session data
    return gameSession.cards;
  });
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const isGameCompleted =
    cards.length > 0 && cards.every((card) => card.matched);

  useEffect(() => {
    if (data && data.memoTest && cards.length === 0) {
      const memoTestImages = data.memoTest.images;
      const cardPairs = [...memoTestImages, ...memoTestImages].map(
        (image, cardsIndex) => ({ id: cardsIndex + 1, image, matched: false })
      );
      const shuffledCards = shuffleArray(cardPairs);
      setCards(shuffledCards);
    }
  }, [cards.length, data]);

  useEffect(() => {
    saveGameSessionLocal({
      memoTestId: Number(memoTestId),
      gameSessionId,
      cards,
    });
  }, [cards]);

  useEffect(() => {
    if (isGameCompleted) {
      deleteGameSessionLocalById(gameSessionId);
      endGameSessionById(gameSessionId);
      saveGameSessionHighestScore({
        gameSessionId,
        memoTestId: Number(memoTestId),
      });
      confetti({
        spread: 160,
        particleCount: 500,
      });
    }
  }, [cards]);

  const handleCardClick = async (cardsIndex: number) => {
    // Do nothing if the card has already been selected or more than 2 cards are selected
    if (selectedCards.length === 2 || selectedCards.includes(cardsIndex)) {
      return;
    }

    setSelectedCards([...selectedCards, cardsIndex]);

    if (selectedCards.length === 1) {
      await updateGameSessionById(gameSessionId);

      const [firstCardIndex] = selectedCards;

      // Check if there are 2 cards are a pair
      if (cards[firstCardIndex].image === cards[cardsIndex].image) {
        setCards((prev) => {
          return prev.map((card, indexState) => {
            if ([firstCardIndex, cardsIndex].includes(indexState)) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
      }

      // Resetting selected cards
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000);
    }
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return {
    loading,
    error,
    memoTestResponse: data,
    cards,
    selectedCards,
    gameSessionId,
    isGameCompleted,
    handleCardClick,
    handleBackHome,
  };
};
