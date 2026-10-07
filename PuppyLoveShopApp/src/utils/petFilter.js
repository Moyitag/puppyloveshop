// El backend no tiene un campo "mascota": se deduce de categories, productType y nombre.
const normalize = (s = "") =>
  s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const PET_REGEX = {
  Gatos: /\b(gatos?|cats?|felinos?)\b/,
  Perros: /\b(perros?|dogs?|caninos?)\b/,
  Aves: /\b(aves?|pajaros?|birds?|loros?)\b/,
  Peces: /\b(pez|peces|fish|acuario)\b/,
};

export const PETS = Object.keys(PET_REGEX);

export function matchesPet(product, pet) {
  if (!pet) return true;
  const text = normalize(
    [product.productName, product.productType, ...(product.categories || [])].join(" ")
  );
  return PET_REGEX[pet].test(text);
}

export function matchesQuery(product, query) {
  const q = normalize(query).trim();
  if (!q) return true;
  const text = normalize(
    [product.productName, product.productType, product.description, ...(product.categories || [])].join(" ")
  );
  return text.includes(q);
}