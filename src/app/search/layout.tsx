import { defaultSort, sorting } from '@/lib/constants';
import { Grid } from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';

import { Suspense } from 'react';
import { getProducts } from '@/lib/shopify';
import Footer from '@/components/layout/footer';
import FilterList from '@/components/layout/search/filter';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black dark:text-white md:flex-row">
        <div className="order-first w-full flex-none md:max-w-[125px]"></div>
        <div className="order-last min-h-screen w-full md:order-none">
          {children}
        </div>
        <div className="order-none flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title="Sort-by" />
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}
