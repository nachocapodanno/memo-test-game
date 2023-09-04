import { gql } from '@apollo/client';

export const CREATE_GAME_SESSION = gql`
  mutation createGameSession($memoTestId: ID!) {
    createGameSession(memoTestId: $memoTestId) {
      id
      memoTestId
      state
      retries
      numberOfPairs
    }
  }
`;
