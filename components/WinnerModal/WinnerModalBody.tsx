type Props = {
  score: number;
  loading: boolean;
  error: any;
};

export const WinnerModalBody = ({ score, loading, error }: Props) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <p className='text-medium'>Your score is</p>
      <p className='font-bold text-4xl mt-2'>{score}</p>
    </>
  );
};
