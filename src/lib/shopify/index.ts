import {
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  HIDDEN_PRODUCT_TAG,
  TAGS,
} from "@/lib/constants";

import { getCollectionProductsQuery, getCollectionsQuery } from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getProductQuery, getProductsQuery } from "./queries/product";

import { isShopifyError } from "@/lib/type-guards";

import {
  Connection,
  Image,
  Product,
  Collection,
  Menu,
  SEO,
  ShopifyCollection,
  ShopifyCollectionsOperation,
  ShopifyMenuOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductsOperation,
  ShopifyCollectionProductsOperation,
} from "./types";

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function shopifyFetch<T>({
  cache = "force-cache",
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
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
  filterHiddenProducts: boolean = true
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
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for handle: ${collection}`);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}


export async function getCollections() : Promise<Collection[]> {

  const res = await shopifyFetch<ShopifyCollectionsOperation> ({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  })


  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: "All products",
      seo :{
        title: 'All',
        description: "All products"
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...reshapeCollections(shopifyCollections)
  ];

  return collections

}


const reshapeCollection = (collection: ShopifyCollection) : Collection | undefined =>{
  if (!collection) return undefined;

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
}


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
  return reshapedCollections
}
  

export async function getMenu(handle: string) : Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation> ({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });


  return (
    res.body?.data?.menu?.items.map((item: {id: string,title: string , url: string}) => ({
      id: item.id,
      title: item.title,
      path: item.url.replace(domain, '').replace('/collections', '/search').replace('/pages', '')
      })) || []
  );
}


export async function getProduct(handle: string) : Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation> ({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    }
  });

  return reshapeProduct(res.body.data.product, false)
}



export async function getProducts({
    query,
    reverse,
    sortKey
} : {
  query?: string,
  reverse? : boolean,
  sortKey? : string;
}) : Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation> ({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products))

}