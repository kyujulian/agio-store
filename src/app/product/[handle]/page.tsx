import type { Metadata } from 'next';

import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import { getProduct, getProducts } from '@/lib/shopify';
import { notFound } from 'next/navigation';

import Gallery from '@/components/product/gallery';
import type { Image } from '@/lib/shopify/types';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}) {}

// const { url, width, height, altText: alt } = product.featuredImage || {};
// const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);
// }
//   return {
//     title: product.seo.title || product.title,
//     description: product.seo.description || product.description,

//     robots: {
//       index: indexable,
//       follow: indexable,
//       googleBot: {
//         index: indexable,
//         follow: indexable,
//       },
//     },
//     openGraph: url
//       ? {
//           images: [
//             {
//               url,
//               width,
//               height,
//               alt,
//             },
//           ],
//         }
//       : null,
//   };
// }
export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const products = await getProducts({});
  const product = await getProduct(params.handle);

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
                alt: image.altText,
              }))}
            />
          </div>
        </div>
      </div>
    </>
  );
}
