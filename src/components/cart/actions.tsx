import { addToCart, createCart, getCart } from '@/lib/shopify';
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
