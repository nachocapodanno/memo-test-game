'use client';

import { gql, useQuery } from '@apollo/client';
import { client } from '../lib/apollo/apollo-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const GET_MEMO_TEST = gql`
  query memoTest($id: ID!) {
    memoTest(id: $id) {
      name
      images
    }
  }
`;
export const MemoTest = ({ id }: { id: number }) => {

  const { loading, error, data } = useQuery(GET_MEMO_TEST, {
    variables: { id },
    client,
  });

  const [cards, setCards] = useState<string[]>([]);
  const [pairedCards, setPairedCards] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  useEffect(() => {
    if (data && data.memoTest) {
      const memoTestImages = data.memoTest.images;
      const cardPairs = [...memoTestImages, ...memoTestImages];
      const shuffledCards = shuffleArray(cardPairs);
      setCards(shuffledCards);
    }
  }, [data]);

  const shuffleArray = (array: any) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (index: number) => {
    // Do not do anything:
    // 1- The card has already been selected
    // 2- There are more than 2 cards selected
    // 3- The card has already been turned
    if (
      selectedCards.length === 2 ||
      selectedCards.includes(index) ||
      pairedCards.includes(cards[index])
    ) {
      return;
    }

    setSelectedCards([...selectedCards, index]);

    // if there are no cards yet, ends
    if (selectedCards.length === 0) return;

    // Check if there are 2 cards are a pair
    const [firstCardIndex] = selectedCards;
    if (cards[firstCardIndex] === cards[index])
      setPairedCards([...pairedCards, cards[firstCardIndex]]);

    setTimeout(() => {
      setSelectedCards([]);
    }, 1000);
  };

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
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer w-48 h-48 ${
              selectedCards.includes(index) ? '' : ''
            }`}
            onClick={() => handleCardClick(index)}
          >
            {(selectedCards.includes(index) || pairedCards.includes(card)) && (
              <Image
                src={card}
                alt={`Card ${index}`}
                width={50}
                height={50}
                className='w-48 h-48 rounded-lg object-contain'
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};
