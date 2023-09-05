'use client';

import { WinnerModal } from './WinnerModal/WinnerModal';
import { Card } from './Card/Card';
import { CloseButton } from './CloseButton/CloseButton';
import { useMemoTest } from '@/hooks/useMemoTes';

export const MemoTest = ({ memoTestId }: { memoTestId: number }) => {
  const {
    loading,
    error,
    memoTestResponse,
    cards,
    selectedCards,
    gameSessionId,
    isGameCompleted,
    handleCardClick,
    handleBackHome,
  } = useMemoTest(memoTestId);

  if (loading) {
    return <span className='loading loading-spinner text-secondary'></span>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div>
        <CloseButton onClick={handleBackHome} />
        <p className='text-4xl font-bold'>{memoTestResponse.memoTest.name}</p>
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
