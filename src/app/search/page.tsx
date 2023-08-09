import Footer from '@/components/layout/footer';
import { Grid } from '@/components/grid';

import { defaultSort, sorting } from '@/lib/constants';
import { getProducts } from '@/lib/shopify';

import { Suspense } from 'react';
import ProductGridItems from '@/components/layout/product-grid-items';

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? 'results' : 'result';
  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no prodyucts that match your search.'
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot; {searchValue} &quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}