declare type Card = {
    id: number;
    image: string;
    matched: boolean;
  };

  declare type GameSession = {
    memoTestId: number;
    gameSessionId: number;
    cards: Card[];
  };