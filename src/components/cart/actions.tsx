'use server';

import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from '@/lib/shopify';

//this vv only works in server components
import { cookies } from 'next/headers';

export const addItem = async (
  variantId: string | undefined,
): Promise<String | undefined> => {
  let cartId = cookies().get('cartId')?.value;

  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }
  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set('cartId', cartId);
  }

  if (!variantId) {
    return 'missing product variant ID';
  }

  try {
    await addToCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
  } catch (error) {
    return 'Error adding item to cart';
  }
};

export async function removeItem(lineId: string): Promise<String | undefined> {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await removeFromCart(cartId, [lineId]);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity({
  lineId,
  variantId,
  quantity,
}: {
  lineId: string;
  variantId: string;
  quantity: number;
}): Promise<String | undefined> {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await updateCart(cartId, [
      { id: lineId, merchandiseId: variantId, quantity },
    ]);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
