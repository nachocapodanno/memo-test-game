'use client';

import confetti from 'canvas-confetti';
import { useQuery } from '@apollo/client';
import { client } from '../lib/apollo/apollo-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import useGameSessions from '@/hooks/useGameSession';
import { getGameScore, shuffleArray } from '@/utils/common';
import { GET_MEMO_TEST } from '@/graphql/queries/getMemoTest';
import { WinnerModal } from './WinnerModal';
import useGameSessionsScores from '@/hooks/useGameSessionScores';
import { GET_GAME_SESSION_BY_ID } from '@/graphql/queries/getGameSessionById';
import { Card } from './Card/Card';

export const MemoTest = ({ memoTestId }: { memoTestId: number }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameSessionId = Number(searchParams.get('sessionId'));

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
    return gameSession ? gameSession.cards : [];
  });
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

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

  const isGameCompleted =
    cards.length > 0 && cards.every((card) => card.matched);

  const getGameSessionScore = async () => {
    const { data } = await client.query({
      query: GET_GAME_SESSION_BY_ID,
      variables: { id: gameSessionId },
    });

    const { retries = 0, numberOfPairs = 0 } = data.gameSession;
    return getGameScore(numberOfPairs, retries);
  };

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

  const handleBackHome = () => {
    router.push('/');
  };

  if (loading) {
    return <span className='loading loading-spinner text-secondary'></span>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div>
        <button
          className='btn btn-square absolute top-5 right-5 m-4'
          onClick={handleBackHome}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        <p className='text-4xl font-bold'>{data.memoTest.name}</p>
      </div>
      <div className='grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 '>
        {cards.map(({ id, image, matched }, cardsIndex) => (
          <Card
            imageUrl={image}
            number={id}
            onClick={() => handleCardClick(cardsIndex)}
            isFlipped={selectedCards.includes(cardsIndex) || matched}
            key={id}
          />
        ))}
      </div>
      {isGameCompleted && <WinnerModal gameSessionId={gameSessionId} />}
    </>
  );
};
