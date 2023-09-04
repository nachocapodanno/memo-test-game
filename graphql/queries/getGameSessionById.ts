import { gql } from '@apollo/client';

export const GET_GAME_SESSION_BY_ID = gql`
  query ($id: ID!) {
    gameSession(id: $id) {
      id
      memoTestId
      retries
      numberOfPairs
      state
    }
  }
`;
