import { gql } from '@apollo/client';

export const END_GAME_SESSION = gql`
  mutation endGameSession($id: ID!) {
    endGameSession(id: $id) {
      id
      state
    }
  }
`;
