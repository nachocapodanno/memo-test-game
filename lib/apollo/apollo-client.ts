import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_MEMO_TEST_API_URL,
    cache: new InMemoryCache(),
});