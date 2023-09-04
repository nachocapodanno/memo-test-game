import { gql } from '@apollo/client';

export const UPDATE_GAME_SESSION_RETRIES = gql`
  mutation updateGameSessionRetries($id: ID!, $retries: Int!) {
    updateGameSessionRetries(id: $id, retries: $retries) {
      id
      memoTestId
      state
      retries
      numberOfPairs
    }
  }
`;
