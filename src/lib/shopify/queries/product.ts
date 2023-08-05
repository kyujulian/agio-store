import productFragment from "../fragments/product";


export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;


export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: 100, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`