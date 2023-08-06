'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const query = formData.get('query') as string;
}

export default function Search() {
  const [searchValue, setSearchValue] = useState('');
  return (
    <form
      onSubmit={onSubmit}
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
    >
      <input
        type="text"
        name="search"
        placeholder="Search for products..."
        autoComplete="off"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:bg-transparent dark:text-neutral-100  dark:placeholder-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
