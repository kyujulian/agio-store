'use client';

import clsx from 'clsx';

import { useRouter, useSearchParams } from 'next/navigation';
import LoadingDots from '@/components/loading-dots';
import type { ProductVariant } from '@/lib/shopify/types';
import { addItem } from '@/components/cart/actions';

import { useTransition } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

export function AddToCart({
  variants,
  availableForSale,
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );

  const selectedVariantId = variant?.id || defaultVariantId;

  const title = !availableForSale
    ? 'Out of stock'
    : !selectedVariantId
    ? 'Please select options'
    : undefined;

  return (
    <button
      aria-label="Add item to cart"
      disabled={isPending || !availableForSale || !selectedVariantId}
      title={title}
      onClick={() => {
        //Safeguard in case someone messes with `disabled` in devools
        if (!availableForSale || !selectedVariantId) return;

        console.log('button clicked');
        startTransition(async () => {
          const error = await addItem(selectedVariantId);
          if (error) {
            console.log('ERROR?!');
            // Trigger the error boundary in the root error.js
            throw new Error(error.toString());
          }

          router.refresh();
        });
      }}
      className={clsx(
        'relative flex w-full items-center justify-center rounded-full bg-orange-600 p-4 tracking-wide text-white hover:opacity-90',
        {
          'cursor-not-allowed opacity-60 hover:opacity-60':
            !availableForSale || !selectedVariantId,
          'cursor-not-allowed': isPending,
        },
      )}
    >
      <div className="absolute left-0 ml-4">
        {!isPending ? (
          <PlusIcon className="h-5" />
        ) : (
          <LoadingDots className="mb-3 bg-white" />
        )}
      </div>
      <span>{availableForSale ? 'Add to cart' : 'Out of stock'}</span>
    </button>
  );
}
