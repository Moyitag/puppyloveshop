import { getAllCarts, createCart, updateCart } from "./api";

// El backend no tiene "un carrito por cliente": hay que listar todos y filtrar por userId.
export async function getMyCart(clientId) {
  const res = await getAllCarts();
  return res.data.find((cart) => (cart.userId?._id || cart.userId) === clientId) || null;
}

// Agrega/actualiza la cantidad de un producto dentro del carrito del cliente.
// Como insertCart/updateCart esperan el arreglo completo de products, reconstruimos
// la lista completa cada vez (con { productId, amount }); el backend recalcula subtotal/total.
export async function addProductToCart(clientId, productId, amount = 1) {
  const existingCart = await getMyCart(clientId);

  if (!existingCart) {
    return createCart({
      userId: clientId,
      products: [{ productId, amount }],
    });
  }

  const products = existingCart.products.map((p) => ({
    productId: p.productId?._id || p.productId,
    amount: p.amount,
  }));

  const idx = products.findIndex((p) => p.productId === productId);
  if (idx >= 0) {
    products[idx].amount += amount;
  } else {
    products.push({ productId, amount });
  }

  return updateCart(existingCart._id, { userId: clientId, products });
}

export async function setCartItemQuantity(clientId, cart, productId, amount) {
  const products = cart.products
    .map((p) => ({
      productId: p.productId?._id || p.productId,
      amount: (p.productId?._id || p.productId) === productId ? amount : p.amount,
    }))
    .filter((p) => p.amount > 0);

  return updateCart(cart._id, { userId: clientId, products });
}

export async function removeCartItem(clientId, cart, productId) {
  const products = cart.products
    .map((p) => ({ productId: p.productId?._id || p.productId, amount: p.amount }))
    .filter((p) => p.productId !== productId);

  return updateCart(cart._id, { userId: clientId, products });
}
