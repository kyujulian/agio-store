import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';
import { Suspense } from 'react';
import LoadingDots from '../loading-dots';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
    showPrice?: boolean;
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        'flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-orange-600 dark:bg-black',
        {
          relative: label,
          'border-2 border-orange-600': active,
          'border-neutral-200 dark:border-neutral-800': !active,
        },
      )}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript

        <Suspense fallback={<LoadingDots className="w-10" />}>
          <Image
            className={clsx('relative h-full w-full object-contain', {
              'transition duration-300 ease-in-out hover:scale-105 ':
                isInteractive,
            })}
            {...props}
          />
        </Suspense>
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
          showPrice={label.showPrice}
        />
      ) : null}
    </div>
  );
}
