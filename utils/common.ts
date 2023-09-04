export const shuffleArray = <T>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

export const getGameScore = (numberOfPairs: number, retries: number) =>
  Math.round((numberOfPairs / retries) * 100);
