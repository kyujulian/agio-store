import { getMenu } from '@/lib/shopify';
import Link from 'next/link';
import type { Menu } from '@/lib/shopify/types';

import LogoSquare from '@/components/logo-square';

import { SITE_NAME } from '@/constants';
import { Suspense } from 'react';

import Cart from '@/components/cart';

import MobileMenu from './mobile-menu';
import Search from './search';

export default async function Navbar() {
  const menu = await getMenu('main-menu');

  return (
    <nav className="relative flex items-center justify-between  bg-white p-4 backdrop-blur-lg dark:bg-neutral-900  lg:px-6">
      <div className="block flex-none md:hidden">
        <MobileMenu menu={menu} />
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            aria-label="Go back home"
            className="mr-2 flex w-full items-center  justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="mr-2 flex items-center justify-center pl-3 font-medium uppercase md:hidden md:w-auto lg:mr-6 lg:block">
              {SITE_NAME}
            </div>
          </Link>

          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className="unterline-offset-4 text-neutral-500 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="hidden justify-center md:flex md:w-1/3">
          <Search />
        </div>
        <div className="flex justify-end md:w-1/3">
          <Suspense>
            <Cart />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
