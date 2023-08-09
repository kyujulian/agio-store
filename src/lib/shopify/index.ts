import {
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  HIDDEN_PRODUCT_TAG,
  TAGS,
} from '@/lib/constants';
import { getPageQuery } from './queries/page';

import { revalidateTag } from "next/cache";

import {
  getCollectionProductsQuery,
  getCollectionsQuery,
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import {
  getProductQuery,
  getProductsQuery,
  getProductRecommendationsQuery,
} from './queries/product';

import {
  addToCartMutation,
  removeFromCartMutation,
  editCartItemsMutation,
  createCartMutation,
} from './mutations/cart';

import { isShopifyError } from '@/lib/type-guards';

import {
  Connection,
  Image,
  Product,
  Collection,
  Menu,
  SEO,
  Page,
  ShopifyPageOperation,
  Cart,
  ShopifyCart,
  ShopifyCollection,
  ShopifyCollectionsOperation,
  ShopifyMenuOperation,
  ShopifyProduct,
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyAddToCartOperation,
  ShopifyProductOperation,
  ShopifyProductsOperation,
  ShopifyCollectionProductsOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyUpdateCartOperation,
} from './types';
import { getCartQuery } from './queries/cart';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge.node);
};
const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

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
};

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for handle: ${collection}`);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products),
  );
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });


  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products',
      },
      path: '/search',
      updatedAt: new Date().toISOString(),
    },
    ...reshapeCollections(shopifyCollections),
  ];

  return collections;
}
export async function getPage(handle: string) : Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation> ({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) return undefined;

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }
  return reshapedCollections;
};

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
    },
  });

  return (
    res.body?.data?.menu?.items.map(
      (item: { id: string; title: string; url: string }) => ({
        id: item.id,
        title: item.title,
        path: item.url
          .replace(domain, '')
          .replace('/collections', '/search')
          .replace('/pages', ''),
      }),
    ) || []
  );
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    },
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId,
    },
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

// cart


export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store',
  });
  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function getCart( cartId: string) : Promise<Cart | undefined> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store'
  })

  //Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined
  }

  return reshapeCart(res.body.data.cart);
}


export async function addToCart (
  cartId: string,
  lines: { merchandiseId : string, quantity: number }[]) : Promise<Cart> {
    const res = await shopifyFetch<ShopifyAddToCartOperation> ({
      query: addToCartMutation,
      variables: {
        cartId,
        lines
      },
      cache: 'no-store'
    });
    return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart ( cartId: string, lineIds: string[]) : Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation> ({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);


}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    cache: 'no-store',
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

function reshapeCart(cart: ShopifyCart) : Cart {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount : "0.00",
      currencyCode: "USD"
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  }
}

//This is called in `app/api/revalidate/route.ts' so providers can control revalidation logic
export function revalidate(req: NextRequest) {
  //We always need to respond with a 200 status code to Shopify,
  // Otherwise it will continue to retry the request
  const collectionWebhooks = [
    'collections/create',
    'collections/delete',
    'collections/update',
  ];
  const productWebhooks = [
    'products/create',
    'products/delete',
    'products/update',
  ];
  const topic = headers().get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret');
    return NextResponse.json({ status: 200 });
}
  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }
  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status:200, revalidated: true, now: Date.now()}); 
}

