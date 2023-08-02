import { SHOPIFY_GRAPHQL_API_ENDPOINT,HIDDEN_PRODUCT_TAG,TAGS } from '@/lib/constants';

import {
  getCollectionProductsQuery,
} from "./queries/collection"

import { isShopifyError } from '@/lib/type-guards';


import {
  Product,
  ShopifyProduct,
  ShopifyCollectionProductsOperation
} from './types'


type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}) : Promise<{status: number; body: T} | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next : {tags}})
      })



      const body = await result.json();

      if (body.errors) {
        throw body.errors[0];
      }

      return {
        status: result.status,
        body
      }

  } catch(e) {
    if(isShopifyError(e)) {
      throw {
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}


const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))){
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  }
}


const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);
      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
}

export async function getCollectionProducts({
  collectionId,
  reverse,
  sortKey
}: {
  collectionId: string;
  reverse?: boolean;
  sortKey?: string;
}) : Promise<Product[]> {

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collectionId,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for handle: ${collectionId}`);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
}