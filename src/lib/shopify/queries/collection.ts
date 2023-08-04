import productFragment from '../fragments/product';
import seoFragment from '../fragments/seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`




export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionsProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`


export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;