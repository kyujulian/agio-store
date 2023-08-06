import type { Metadata } from 'next';

import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import {
  getProduct,
  getProducts,
  getProductRecommendations,
} from '@/lib/shopify';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ProductDescription from '@/components/product/description';

import Gallery from '@/components/product/gallery';
import type { Image } from '@/lib/shopify/types';
import { GridTileImage } from '@/components/grid/tile';
import Link from 'next/link';
import Footer from '@/components/layout/footer';

// export async function generateMetadata({
//   params,
// }: {
//   params: { handle: string };
// }) {}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  // const products = await getProducts({});
  const product = await getProduct(params.handle);

  console.log('IMAGES', product);

  if (!product) {
    return notFound();
  }

  const productJsonLd = {};

  return (
    <>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      /> */}
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={product.images.map((image: Image) => ({
                src: image.url,
                altText: image.altText,
              }))}
            />
          </div>
          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>
        <Suspense>
          <RelatedProducts id={product.id} />
        </Suspense>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  if (!relatedProducts.length) {
    return null;
  }
  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">RelatedProducts</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li key={product.handle}>
            <Link
              className="relative h-full w-full"
              href={`/products/${product.handle}`}
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
