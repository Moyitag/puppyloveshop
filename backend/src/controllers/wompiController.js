import fetch from "node-fetch";
import crypto from "crypto";
import { config } from "../config.js";
import salesModel from "../models/sales.js";
import shoppingCartModel from "../models/shoppingCart.js";
import clientModel from "../models/clients.js";

const wompiController = {};

const REGION_CODES = {
  ahuachapan: "SV-AH", cabanas: "SV-CA", chalatenango: "SV-CH",
  cuscatlan: "SV-CU", "la libertad": "SV-LI", "la paz": "SV-PA",
  "la union": "SV-UN", morazan: "SV-MO", "san miguel": "SV-SM",
  "san salvador": "SV-SS", "san vicente": "SV-SV", "santa ana": "SV-SA",
  sonsonate: "SV-SO", usulutan: "SV-US",
};

const normalize = (value = "") =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

const credentialsConfigured = () =>
  [config.wompi.grant_type, config.wompi.audience, config.wompi.client_id, config.wompi.client_secret]
    .every((value) => typeof value === "string" && value.trim());

const getToken = async () => {
  if (!credentialsConfigured()) throw Object.assign(new Error("Wompi credentials are not configured"), { status: 503 });
  const response = await fetch("https://id.wompi.sv/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: config.wompi.grant_type,
      audience: config.wompi.audience,
      client_id: config.wompi.client_id,
      client_secret: config.wompi.client_secret,
    }),
  });
  if (!response.ok) throw Object.assign(new Error("Wompi authentication failed"), { status: 502 });
  return (await response.json()).access_token;
};

const luhnValid = (number) => {
  let sum = 0;
  let double = false;
  for (let index = number.length - 1; index >= 0; index -= 1) {
    let digit = Number(number[index]);
    if (double) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
};

const validRedirect = (url) =>
  /^https:\/\//i.test(url) ||
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?/i.test(url) ||
  /^puppyloveshop:\/\//i.test(url);

wompiController.cardPayment = async (req, res) => {
  try {
    const { shoppingCartId, card, customer, deliveryAddress, redirectUrl } = req.body;
    const cart = await shoppingCartModel.findById(shoppingCartId);
    if (!cart || cart.userId.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: "Active cart not found" });
    }
    if (cart.status !== "active" || cart.products.length === 0) {
      return res.status(409).json({ message: "The cart is not available for payment" });
    }

    const number = String(card?.number || "").replace(/\D/g, "");
    const cvv = String(card?.cvv || "").replace(/\D/g, "");
    const phone = String(customer?.phone || "").replace(/\D/g, "");
    const month = Number(card?.expiryMonth);
    let year = Number(card?.expiryYear);
    if (year < 100) year += 2000;
    const now = new Date();
    const expiryIsValid = month >= 1 && month <= 12 &&
      (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1));
    if (!config.wompi.mock_mode && (number.length < 13 || number.length > 19 || !luhnValid(number))) {
      return res.status(400).json({ message: "Invalid card number" });
    }
    if ((!config.wompi.mock_mode && (!/^\d{3,4}$/.test(cvv) || !expiryIsValid)) ||
        (config.wompi.mock_mode && (!number || !/^\d{3}$/.test(cvv) || !month || !year))) {
      return res.status(400).json({ message: "Invalid expiration date or CVV" });
    }
    if (!/^[267]\d{7}$/.test(phone)) {
      return res.status(400).json({ message: "El teléfono debe ser un número salvadoreño válido de 8 dígitos" });
    }
    if (!validRedirect(redirectUrl || "")) {
      return res.status(400).json({ message: "Invalid payment redirect URL" });
    }

    const client = await clientModel.findById(req.user.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    const holderName = String(customer?.name || client.fullName).trim().split(/\s+/);
    const firstName = holderName.shift();
    const lastName = holderName.join(" ") || firstName;
    const regionCode = REGION_CODES[normalize(deliveryAddress?.department)];
    if (!regionCode) return res.status(400).json({ message: "Select a valid department of El Salvador" });

    if (config.wompi.mock_mode) {
      const separator = redirectUrl.includes("?") ? "&" : "?";
      return res.status(200).json({
        transactionId: `DEMO-${Date.now()}`,
        isReal: false,
        paymentUrl: `${redirectUrl}${separator}status=approved&demo=true`,
      });
    }

    const token = await getToken();
    const wompiResponse = await fetch("https://api.wompi.sv/TransaccionCompra/3DS", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        tarjetaCreditoDebito: {
          numeroTarjeta: number,
          cvv,
          mesVencimiento: month,
          anioVencimiento: year,
        },
        monto: cart.totalWithDiscount,
        urlRedirect: redirectUrl,
        nombre: firstName,
        apellido: lastName,
        email: String(customer?.email || client.email).trim(),
        ciudad: String(deliveryAddress?.city || "").trim(),
        direccion: String(deliveryAddress?.address || "").trim(),
        idPais: "SV",
        idRegion: regionCode,
        codigoPostal: String(customer?.postalCode || "").trim(),
        telefono: phone,
        datosAdicionales: { shoppingCartId: cart._id.toString(), clientId: client._id.toString() },
        configuracion: {
          notificarTransaccionCliente: true,
          ...(config.wompi.webhook_url ? { urlWebhook: config.wompi.webhook_url } : {}),
        },
      }),
    });
    const data = await wompiResponse.json().catch(() => ({}));
    if (!wompiResponse.ok || !data.urlCompletarPago3Ds || !data.idTransaccion) {
      console.error("Wompi payment error", wompiResponse.status, data);
      return res.status(502).json({ message: data.message || data.error || "Wompi could not start the payment" });
    }
    return res.status(200).json({
      transactionId: data.idTransaccion,
      isReal: Boolean(data.esReal),
      paymentUrl: data.urlCompletarPago3Ds,
    });
  } catch (error) {
    console.error("Wompi error:", error.message);
    return res.status(error.status || 502).json({ message: error.message || "Wompi connection failed" });
  }
};

wompiController.webhook = async (req, res) => {
  try {
    const receivedHash = req.get("wompi_hash") || "";
    const expectedHash = crypto
      .createHmac("sha256", config.wompi.client_secret)
      .update(req.rawBody || Buffer.from(JSON.stringify(req.body)))
      .digest("hex");
    if (!receivedHash || receivedHash.length !== expectedHash.length ||
        !crypto.timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash))) {
      return res.status(401).json({ message: "Invalid webhook signature" });
    }
    const transactionId = req.body.IdTransaccion || req.body.idTransaccion;
    const result = req.body.ResultadoTransaccion || req.body.resultadoTransaccion;
    const paymentStatus = result === "ExitosaAprobada" ? "pagado" : "rechazado";
    await salesModel.findOneAndUpdate({ wompiTransactionId: transactionId }, { paymentStatus });
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Wompi webhook error:", error.message);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};

export default wompiController;
