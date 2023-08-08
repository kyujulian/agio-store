import { getPage } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Prose from '@/components/prose';

export default async function Page({ params }: { params: { page: string } }) {
  const page = await getPage(params.page);

  if (!page) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      <Prose className="mb-8" html={page.body as string} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        ).format(new Date(page.updatedAt))}.`}
      </p>
    </>
  );
}
