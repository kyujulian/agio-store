export type Product = Omit<ShopifyProduct, 'variants' | 'images' > & {
  variants: ProductVariant[];
  images: Image[];
}


export type Edge<T> = {
  node: T;
}

export type Connection<T> = {
  edges: Array<Edge<T>>;
}

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
}


export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice : Money;
    minVariantPrice : Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updateAt: string;
};

export type SEO = {
  title: string;
  description: string;
}


export type Money = {
  amount: string;
  currencyCode: string;
}

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  }
}