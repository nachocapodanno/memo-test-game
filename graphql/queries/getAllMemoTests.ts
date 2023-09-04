import { gql } from '@apollo/client';

export const GET_ALL_MEMO_TESTS = gql`
  query memoTests {
    memoTests {
      data {
        id
        name
        images
      }
    }
  }
`;
