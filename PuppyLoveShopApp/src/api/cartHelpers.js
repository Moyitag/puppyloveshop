import { getMyCart as fetchMyCart, createCart, updateCart } from "./api";

const itemPayload = (item) => ({
  productId: item.productId?._id || item.productId,
  variantId: item.variantId,
  amount: item.amount,
});

const sameItem = (item, productId, variantId) =>
  (item.productId?._id || item.productId) === productId &&
  String(item.variantId || "") === String(variantId || "");

export async function getMyCart() {
  const response = await fetchMyCart();
  return response.data || null;
}

export async function addProductToCart(productId, variantId, amount = 1) {
  const cart = await getMyCart();
  if (!cart) {
    return createCart({ products: [{ productId, variantId, amount }] });
  }

  const products = cart.products.map(itemPayload);
  const index = cart.products.findIndex((item) => sameItem(item, productId, variantId));
  if (index >= 0) products[index].amount += amount;
  else products.push({ productId, variantId, amount });
  return updateCart(cart._id, { products });
}

export function setCartItemQuantity(cart, productId, variantId, amount) {
  const products = cart.products.map((item) => ({
    ...itemPayload(item),
    amount: sameItem(item, productId, variantId) ? amount : item.amount,
  }));
  return updateCart(cart._id, { products });
}

export function removeCartItem(cart, productId, variantId) {
  const products = cart.products
    .filter((item) => !sameItem(item, productId, variantId))
    .map(itemPayload);
  return updateCart(cart._id, { products });
}
