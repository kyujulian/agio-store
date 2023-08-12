'use client';

import Link from 'next/link';
import { Transition } from '@headlessui/react';

import { Suspense, useEffect, useState } from 'react';

export default function HeroText({
  productUrl,
}: {
  productUrl: string;
}): JSX.Element {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  });

  return (
    <div className=" mb-[100px] md:mb-0 md:h-[70vh]">
      <Transition
        show={show}
        enter="transition-all ease duration-300"
        enterFrom="opacity-0 translate-y-[100px]"
        enterTo="opacity-100 translate-y-0"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className=" mt-[100px] flex h-full flex-col items-center justify-center text-white transition-all">
          <h1 className="py-3  text-center text-[18px] font-bold sm:text-[28px] md:text-[42px] ">
            Born in the Streets, Worn Everywhere
          </h1>

          <Transition.Child
            enter="transition-all ease duration-300 delay-300"
            enterFrom="opacity-0 translate-y-[100px]"
            enterTo="opacity-100 translate-y-0"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <p className="w-[600px] py-3 text-center text-[14px] font-light md:text-[24px]">
              Snapback Caps that Define Your Style.
            </p>
            <div className="text-md mx-auto flex items-center justify-center rounded-md p-4 transition  duration-200 hover:scale-110 hover:cursor-pointer md:text-lg  ">
              <Link href={`/product/${productUrl}`}>
                Check out our{' '}
                <p className="inline font-bold  text-orange-500">
                  Newest Release
                </p>
              </Link>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
