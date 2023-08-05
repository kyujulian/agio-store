import { getCollectionProducts, getCollections } from '@/lib/shopify';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

export default async function Carousel() {
  const products = await getCollectionProducts({
    collection: `hidden-homepage-carousel`,
  });

  const collections = await getCollections();
  if (!products?.length) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto pb-5 pt-1">
      <ul className="flex animate-carousel gap-4">
        {[...products, ...products].map((product, i) => (
          <li
            key={`${product.handle}-${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link
              href={`/product/${product.handle}`}
              className="relative h-full w-full"
            >
              <GridTileImage
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 25vw,(min-width: 768px) 33vw, 50vw"
                alt={product.title}
                label={{
                  title: product.title as string,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
