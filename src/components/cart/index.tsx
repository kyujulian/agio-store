import CartModal from "./modal";

import { cookies } from "next/headers";

export default function Cart() {
  const cartId = cookies().get("cartId")?.value;

  return <CartModal />;
}
