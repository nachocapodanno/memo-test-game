'use client';

import { useQuery } from '@apollo/client';
import { client } from '../lib/apollo/apollo-client';
import { GET_ALL_MEMO_TESTS } from '@/graphql/queries/getAllMemoTests';
import { MemoTestCard } from './MemoTestCard/MemoTestCard';
import { useMemoTestList } from '@/hooks/useMemoTestList';

function MemoTestsList() {
  const {
    handleStartSession,
    handleContinueSession,
    showContinueButton,
    getHighestScoreValue,
  } = useMemoTestList();

  const { loading, error, data } = useQuery(GET_ALL_MEMO_TESTS, { client });

  if (loading) {
    return <span className='loading loading-spinner text-secondary'></span>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const memoTests = data.memoTests.data;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-4 mt-10'>
      {memoTests.map((memoTest: any) => (
        <MemoTestCard
          key={memoTest.id}
          title={memoTest.name}
          body={
            <>
              <div className='flex items-center gap-2'>
                <p className='stat-title antialiased text-slate-300 grow-0'>
                  Highest Score
                </p>
                <span className='text-xl'>🏆</span>
              </div>
              <div className='stat-value'>
                {getHighestScoreValue(memoTest.id)}
              </div>
            </>
          }
          onStartSession={() => handleStartSession(memoTest.id)}
          onContinueSession={() => handleContinueSession(memoTest.id)}
          showContinueButton={showContinueButton(Number(memoTest.id))}
        />
      ))}
    </div>
  );
}

export default MemoTestsList;
