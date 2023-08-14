'use client';
import { Brand, whiteBrands, blackBrands } from '@/../assets/brands';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Brands() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (window.matchMedia) {
      const query = window.matchMedia('(prefers-color-scheme: dark)');
      setDarkMode(query.matches);

      query.addEventListener('change', (e) => {
        setDarkMode(e.matches);
      });
    }
  }, [darkMode]);

  const brands = darkMode ? (whiteBrands as Brand[]) : (blackBrands as Brand[]);
  return (
    <div className="flex w-full justify-center bg-neutral-100 py-10 dark:bg-neutral-900">
      <ul className="flex w-[60%] items-center justify-around   md:w-[60%] ">
        {brands.map((brand, index) => {
          return (
            <li key={brand.name}>
              <Image
                src={brand.src}
                alt={brand.name}
                width={100}
                height={100}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
