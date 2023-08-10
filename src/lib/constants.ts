export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-04/graphql.json';
export const TAGS = {
  collections: 'collections',
  products: 'products'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
}
export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE" | "TITLE";
  reverse: boolean;
}


export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: "Trending", slug: "trending-desc", sortKey: "BEST_SELLING", reverse: false }, // ascending 
  { title: "Latest arrivals", slug: "latest-desc", sortKey: "CREATED_AT", reverse: true }, // descending
  { title: "Price: Low to high", slug: "price-asc", sortKey: "PRICE", reverse: false }, // ascending
  { title: "Price: High to low", slug: "price-desc", sortKey: "PRICE", reverse: true }, // descending
]
