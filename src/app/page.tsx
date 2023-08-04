import { Montserrat } from "@next/font/google";
// import { GridItem } from "components/grid";
import { getCollectionProducts } from "@/lib/shopify";
import { ThreeItemGrid } from "@/components/grid/three-items";
import { Suspense } from "react";
import Carousel from "@/components/carousel";
import Footer from "@/components/layout/footer";

export const metadata = {
  description:
    "Portfolio project: High-performance e-commerce store built with Next.js and Shopify",
  openGraph: {
    type: "website",
  },
};

export default async function Home() {
  const homepageItems = await getCollectionProducts({
    collection: "Caps",
  });
  return (
    <>
      <ThreeItemGrid />
      <Suspense>
        <Carousel />
        <Suspense>
          <Footer />
        </Suspense>
      </Suspense>
    </>
  );
}
