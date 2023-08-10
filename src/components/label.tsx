import clsx from 'clsx';
import Price from './price';

export default function Label({
  title,
  amount,
  currencyCode,
  position = 'bottom',
  showPrice = true,
}: {
  title: string;
  amount: string;
  currencyCode: string;
  showPrice?: boolean;
  position?: 'bottom' | 'center';
}) {
  return (
    <div
      className={clsx(
        '@container/label absolute bottom-0 left-0 flex w-full px-4  pb-4',
        {
          'lg:px-20 lg:pb-[35%]': position === 'center',
        },
      )}
    >
      <div className="@[275px]/label:text-xs dark:border-neutral-8000 flex items-center rounded-full border bg-white/70 p-1 text-[10px] font-semibold text-black backdrop-blur-md dark:bg-black/70 dark:text-white">
        <h3 className="mr-4 inline p-2 pl-2  text-[18px] leading-none tracking-tight">
          {title}
        </h3>
        {showPrice && (
          <Price
            className="flex-none rounded-full bg-orange-600 p-2 text-white"
            amount={amount}
            currencyCode={currencyCode}
            currencyCodeClassName="hidden @[275]/label:inline"
          />
        )}
      </div>
    </div>
  );
}
