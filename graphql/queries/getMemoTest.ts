import { gql } from '@apollo/client';

export const GET_MEMO_TEST = gql`
  query memoTest($id: ID!) {
    memoTest(id: $id) {
      name
      images
    }
  }
`;
