# Puppy Love Shop — App Móvil (React Native + Expo)

**Instituto Técnico Ricaldone — Tercer año de Desarrollo de Software**
**Módulo 5: Desarrollo de componentes para dispositivos móviles**
**Proyecto:** Tienda en línea — avance de aplicación móvil (PTC)
**Docente:** Daniel Wilfredo Granados Hernández

**Equipo No.:** _(completar)_
**Integrantes:**
- _(nombre 1)_
- _(nombre 2)_
- _(nombre 3)_

App cliente para la tienda de mascotas. Se conecta al backend Node.js/Express + MongoDB del proyecto.

## Dependencias instaladas

- `expo` — framework base (SDK 57)
- `react-navigation` (`native`, `native-stack`, `bottom-tabs`) — navegación por pestañas y pilas
- `axios` — cliente HTTP hacia el backend, configurado con `withCredentials` para la cookie de sesión
- `@react-native-async-storage/async-storage` — persistencia local de la sesión del cliente
- `expo-image-picker` — reservado para selección de imágenes (reseñas/perfil a futuro)

## Configuraciones adicionales hechas al proyecto

- Ícono (`icon`), ícono adaptativo de Android (`adaptive-icon`) y Splash Screen personalizados en `app.json` (assets en `/assets`).
- Pantalla de carga adicional (`WelcomeLoadingScreen.js`) que se muestra después del Splash Screen nativo mientras se revisa la sesión guardada.
- Componentes reutilizables (`AppButton`, `AppTextInput`, `ProductCard`) usados en toda la app para mantener una sola nomenclatura y estilo.

## Instalación

```bash
cd PuppyLoveShopApp
rm -rf node_modules package-lock.json   # o borra la carpeta node_modules en Windows
npm install
npx expo install --fix   # alinea automáticamente las versiones exactas del SDK 57
npx expo start -c
```

> El proyecto está fijado a Expo SDK 57 para que coincida con tu app Expo Go (que instala la SDK más reciente automáticamente). Si en el futuro Expo Go se actualiza a otra SDK, corre `npx expo install --fix` de nuevo para realinear.

Escanea el QR con la app **Expo Go** (Android/iOS) o presiona `a` / `i` para emulador.

## Configurar el backend

Edita `src/api/api.js` y cambia:

```js
export const API_URL = "http://192.168.1.100:4000/api";
```

- En desarrollo con dispositivo físico: usa la IP local de tu PC (no `localhost`).
- En producción: usa el dominio real del backend desplegado.

## Rutas del backend que la app usa (verificadas contra tu backend real)

| Función | Endpoint | Notas |
|---|---|---|
| Registro cliente | `POST /api/registerClient` | body: `{ fullName, email, password, phoneNumber }` |
| Login cliente | `POST /api/loginClient` | body: `{ email, password }`. Responde `{ id, fullName }` y deja sesión en cookie httpOnly `authCookie` |
| Listar productos | `GET /api/products` | campos: `productName, images[], price, productType, variants[]` |
| Reseñas por producto | `GET /api/productReview/product/:productId` | |
| Crear reseña | `POST /api/productReview` | body: `{ userId, productId, rating, title, experienceType, details, certifiedPurchase }` |
| Listar carritos | `GET /api/shoppingCart` | no hay endpoint por cliente: la app filtra por `userId` en `src/api/cartHelpers.js` |
| Crear/actualizar carrito | `POST` / `PUT /api/shoppingCart/:id` | body: `{ userId, products: [{ productId, amount }] }` — el backend recalcula subtotales |
| Crear venta (checkout) | `POST /api/sales` | body: `{ shoppingCartId, deliveryAddress: { address, city, department, reference }, paymentMethod }` |
| Listar ventas | `GET /api/sales` | la app filtra las del cliente logueado en `ProfileScreen.js` |

**Auth por cookie, no por token:** tu backend usa `res.cookie("authCookie", ...)` con `httpOnly`. La app ya manda `withCredentials: true` en axios para que la cookie viaje en cada request — no hay que guardar ningún token manualmente.

Si algo cambia en el backend, el único archivo que centraliza las rutas es `src/api/api.js` (y la lógica de carrito en `src/api/cartHelpers.js`).

## Pantallas incluidas

- Login / Registro
- Catálogo con búsqueda y filtro por subcategoría
- Detalle de producto + reseñas con calificación
- Carrito (editar cantidades, eliminar)
- Checkout (dirección, método de pago, resumen)
- Perfil (datos del cliente, historial de pedidos, cerrar sesión)

## Estructura de carpetas

```
src/
  api/          -> api.js (endpoints) y cartHelpers.js (lógica de carrito)
  components/   -> AppButton, AppTextInput, ProductCard (reutilizables)
  context/      -> AuthContext.js (sesión del cliente)
  navigation/   -> AppNavigator.js (única lógica de navegación de la app)
  screens/      -> una pantalla por archivo
assets/         -> icon.png, adaptive-icon.png, splash.png, favicon.png
```

## Notas

- La sesión se maneja con la cookie httpOnly que setea el backend (`authCookie`); axios usa `withCredentials: true` para reenviarla automáticamente.
- El acceso al catálogo requiere sesión iniciada (ajustable en `AppNavigator.js` si prefieres que sea público).
- Los íconos y el splash en `/assets` son un placeholder (una pata generada por código); reemplázalos por el logo real del proyecto cuando lo tengan.

## Pendiente por parte del equipo (no depende del código)

- [ ] Verificar que todas las pantallas coincidan con los mockups de Figma del proyecto.
- [ ] Tener datos reales cargados en la base de datos (productos, etc.) para la demo.
- [ ] Repositorio de GitHub con todos los integrantes como colaboradores y al menos 5 commits cada uno.
- [ ] Completar los nombres del equipo arriba en este README.
