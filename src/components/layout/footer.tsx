import Link from 'next/link';
import LogoSquare from '../logo-square';
import { SITE_NAME, COMPANY_NAME } from '@/constants';
import { getMenu } from '@/lib/shopify';
import { Suspense } from 'react';
import FooterMenu from './footer-menu';

import GithubIcon from '@/components/icons/github';

export default async function Footer() {
  const skeleton = `w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700`;
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const menu = await getMenu('footer');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="relative z-10 border-t border-neutral-200 bg-white text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6  px-6 py-12 text-sm  md:flex-row md:gap-12 md:px-4 xl:px-0 ">
        <div>
          <Link
            className=" flex items-center gap-2 text-black dark:text-white md:pt-1"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`footer-skeleton-${i}`} className={skeleton} />
              ))}
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
        <div className="md:ml-auto">
          <a
            className="flex h-12 flex-none items-center justify-center rounded-md border border-neutral-200 bg-white text-xs text-black dark:border-neutral-700 dark:bg-black dark:text-white"
            aria-label="Github Repository"
            href="https://github.com/kyujulian/agio-store"
          >
            <div className="p-3">
              <GithubIcon className="h-6" />
            </div>
            <span className="px-3"> Source </span>
          </a>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 xl:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.')
              ? '.'
              : ''}{' '}
            All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p> Designed as Portfolio project</p>
          <p className="md:ml-auto">
            by{' '}
            <a
              href="https://github.com/kyujulian/"
              className="text-black dark:text-white"
            >
              ♦ Julian
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
