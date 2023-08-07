import { AddToCart } from '@/components/cart/add-to-cart';
import Price from '@/components/price';
import { Product } from '@/lib/shopify/types';
import Prose from '@/components/prose';
import VariantSelector from './variant-selector';

export default function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b py-10 pb-6 dark:border-neutral-700">
        <h1 className="mb-5 text-5xl font-medium">{product.title}</h1>
        <div className="mb-5 mr-auto w-auto rounded-full bg-blue-600 p-3 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
        {product.descriptionHtml ? (
          <Prose
            className="mb-6 py-10 text-sm leading-tight dark:text-white/[60%]"
            html={product.descriptionHtml}
          />
        ) : null}
      </div>
      <AddToCart
        variants={product.variants}
        availableForSale={product.availableForSale}
      />
    </>
  );
}
