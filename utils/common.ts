export const shuffleArray = <T>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

export const getGameScore = (numberOfPairs: number, retries: number) => {
  const score = Math.round((numberOfPairs / retries) * 100);
  return score ===  Infinity ? 0 : score;
}
  
