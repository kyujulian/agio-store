"use-client";

import OpenCart from "./open-cart";

export default function CartModal() {
  const mockQuantity = 1;
  return (
    <>
      <button aria-label="Open cart">
        <OpenCart quantity={mockQuantity} />
      </button>
    </>
  );
}
