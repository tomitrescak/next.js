import App from '../components/App'
import InfoBox from '../components/InfoBox'
import Header from '../components/Header'
import Submit from '../components/Submit'
import PostList, {
  ALL_POSTS_QUERY,
  allPostsQueryVars,
} from '../components/PostList'
import { initializeApollo, addApolloState } from '../lib/apolloClient'

const SSRPage = () => (
  <App>
    <Header />
    <InfoBox>ℹ️ This page shows how to use SSR with Apollo.</InfoBox>
    <Submit />
    <PostList />
  </App>
)

// DISCLAIMER: Using server side props effectively returns the WHOLE cache 
//   that was populated during the server side render.
//   Consequently, you are fetching the data from server on every page transition, 
//   even if it is already cached on client.
//   If you want to take advantage of client side cache, you have to use "getInitialProps" method below
//   But, in that case the data will be fetched from client on page transitions.
//   Please choos depending on your use case and security requirements.

export async function getServerSideProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: ALL_POSTS_QUERY,
    variables: allPostsQueryVars,
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}

// ALTERNATIVE approach that takes advantage of client side cache
//  for apollo and fetches data on client on page transition
// SSRPage.getInitialProps = async (context) => {
//  if (typeof window == 'undefined') {
//    const apolloClient = initializeApollo()
//
//    await apolloClient.query({
//      query: ALL_POSTS_QUERY,
//      variables: allPostsQueryVars,
//    })
// 
//    // we have to return plain props in getInitialProps
//    return { 
//      ...addApolloState(apolloClient, {
//        props: {},
//      }).props
//    }
//  }
// }

export default SSRPage
