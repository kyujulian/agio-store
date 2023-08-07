export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};

export type Menu = {
  id: string;
  title: string;
  path: string;
};

export type Edge<T> = {
  node: T;
};

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

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

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        id: string;
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
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
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updateAt: string;
};
export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type SEO = {
  title: string;
  description: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

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
  };
};


//cart 
export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOption: {
      name: string;
      value: string;
    }[]
    product: Product;
  };
};


export type ShopifyCart = {
  id: string,
  checkoutUrl:  string,
  cost: {
    subtotalAmount: Money,
    totalAmount: Money,
    totalTaxAmount: Money
  }
  lines: Connection<CartItem>;
  totalQuantity: number
}

//feels like a hack
export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { 
    cartCreate: {
      cart: ShopifyCart;
    };
  };
}

export type ShopifyAddToCartOperation = {
  data : {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables : {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[]
  };
};
