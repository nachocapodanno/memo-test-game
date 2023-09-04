'use client';

import { useQuery } from '@apollo/client';
import { client } from '../lib/apollo/apollo-client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import useGameSessions from '@/hooks/useGameSession';
import { shuffleArray } from '@/utils/common';
import { GET_MEMO_TEST } from '@/graphql/queries/getMemoTest';
import { WinnerModal } from './WinnerModal';

export const MemoTest = ({ memoTestId }: { memoTestId: number }) => {
  const searchParams = useSearchParams();
  const gameSessionId = Number(searchParams.get('sessionId'));

  const { loading, error, data } = useQuery(GET_MEMO_TEST, {
    variables: { id: memoTestId },
    client,
  });

  const {
    updateGameSessionById,
    saveGameSessionLocal,
    getGameSessionByMemoTestId,
  } = useGameSessions();

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

  const showEndGameModal =
    cards.length > 0 && cards.every((card) => card.matched);

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

  useEffect(() => {
    saveGameSessionLocal({
      memoTestId: Number(memoTestId),
      gameSessionId,
      cards,
    });
  }, [cards]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <p className='text-4xl font-bold'>MemoTest Game</p>
      <div className='grid grid-cols-4 gap-4'>
        {cards.map(({ id, image, matched }, cardsIndex) => (
          <div
            key={id}
            className={`p-4 border rounded-lg cursor-pointer w-48 h-48 items-center justify-center flex`}
            onClick={() => handleCardClick(cardsIndex)}
          >
            {selectedCards.includes(cardsIndex) || matched ? (
              <Image
                src={image}
                alt={`Card ${id}`}
                width={50}
                height={50}
                className='w-48 h-48 rounded-lg object-contain'
              />
            ) : (
              <p className='text-2xl'>{id}</p>
            )}
          </div>
        ))}
      </div>
      {showEndGameModal && <WinnerModal gameSessionId={gameSessionId} />}
    </>
  );
};
