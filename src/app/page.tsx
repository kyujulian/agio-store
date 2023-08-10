import { Montserrat } from '@next/font/google';
// import { GridItem } from "components/grid";
import { getCollectionProducts } from '@/lib/shopify';
import { ThreeItemGrid } from '@/components/grid/three-items';
import Hero from '@/components/hero';
import { Suspense } from 'react';
import Carousel from '@/components/carousel';
import Footer from '@/components/layout/footer';
import Brands from '@/components/main-page/brands';
import Outro from '@/components/main-page/outro';

export const metadata = {
  description:
    'Portfolio project: High-performance e-commerce store built with Next.js and Shopify',
  openGraph: {
    type: 'website',
  },
};

export default async function Home() {
  const homepageItems = await getCollectionProducts({
    collection: 'Caps',
  });
  return (
    <>
      <Hero />
      {/* <ThreeItemGrid /> */}
      <Suspense>
        <Carousel />
        <Brands />
        <Outro />
        <Suspense>
          <Footer />
        </Suspense>
      </Suspense>
    </>
  );
}
