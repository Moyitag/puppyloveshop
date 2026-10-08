import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import clientModel from "../models/clients.js";

const CODE_LIFETIME_MS = 10 * 60 * 1000;
const REQUEST_COOLDOWN_MS = 60 * 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genericMessage = "Si ese correo tiene una cuenta, recibirás un código para recuperar tu contraseña.";

function codeHash(clientId, code) {
  return createHash("sha256")
    .update(`${clientId}:${code}:${process.env.JWT_SECRET_KEY || ""}`)
    .digest("hex");
}

function mailTransport() {
  const user = process.env.USER_EMAIL;
  const pass = process.env.USER_PASSWORD;
  if (!user || !pass) return null;

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
  }
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

export async function requestReset(req, res) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (!EMAIL_REGEX.test(email)) return res.status(400).json({ message: "Ingresa un correo válido." });

  const transport = mailTransport();
  if (!transport) return res.status(503).json({ message: "La recuperación por correo no está disponible en este momento." });

  try {
    const client = await clientModel.findOne({ email, status: true })
      .select("+passwordResetRequestedAt +passwordResetCodeHash +passwordResetExpiresAt +passwordResetAttempts");
    if (!client) return res.json({ message: genericMessage });

    if (client.passwordResetRequestedAt && Date.now() - client.passwordResetRequestedAt.getTime() < REQUEST_COOLDOWN_MS) {
      return res.json({ message: genericMessage });
    }

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    client.passwordResetCodeHash = codeHash(client.id, code);
    client.passwordResetExpiresAt = new Date(Date.now() + CODE_LIFETIME_MS);
    client.passwordResetRequestedAt = new Date();
    client.passwordResetAttempts = 0;
    await client.save();

    try {
      await transport.sendMail({
        from: `Puppy Love Shop <${process.env.USER_EMAIL}>`,
        to: email,
        subject: "Código para recuperar tu contraseña",
        text: `Tu código de Puppy Love Shop es ${code}. Vence en 10 minutos. Si no lo solicitaste, ignora este correo.`,
      });
    } catch (error) {
      client.passwordResetCodeHash = undefined;
      client.passwordResetExpiresAt = undefined;
      client.passwordResetRequestedAt = undefined;
      await client.save();
      console.error("Could not send password recovery email", error);
      return res.status(503).json({ message: "No pudimos enviar el correo. Intenta de nuevo más tarde." });
    }

    return res.json({ message: genericMessage });
  } catch (error) {
    console.error("Password recovery request failed", error);
    return res.status(500).json({ message: "No se pudo procesar la solicitud." });
  }
}

export async function resetPassword(req, res) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
  const password = req.body?.password;

  if (!EMAIL_REGEX.test(email) || !/^\d{6}$/.test(code) || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "Revisa el correo, el código y la contraseña (mínimo 8 caracteres)." });
  }

  try {
    const client = await clientModel.findOne({ email, status: true })
      .select("+passwordResetCodeHash +passwordResetExpiresAt +passwordResetAttempts");
    const invalid = () => res.status(400).json({ message: "El código es incorrecto o venció. Solicita uno nuevo." });
    if (!client?.passwordResetCodeHash || !client.passwordResetExpiresAt || client.passwordResetExpiresAt.getTime() < Date.now() || client.passwordResetAttempts >= 5) {
      return invalid();
    }

    const submittedHash = Buffer.from(codeHash(client.id, code), "hex");
    const savedHash = Buffer.from(client.passwordResetCodeHash, "hex");
    if (savedHash.length !== submittedHash.length || !timingSafeEqual(savedHash, submittedHash)) {
      client.passwordResetAttempts += 1;
      await client.save();
      return invalid();
    }

    client.password = await bcrypt.hash(password, 10);
    client.passwordResetCodeHash = undefined;
    client.passwordResetExpiresAt = undefined;
    client.passwordResetRequestedAt = undefined;
    client.passwordResetAttempts = 0;
    await client.save();
    return res.json({ message: "Contraseña actualizada. Ya puedes iniciar sesión." });
  } catch (error) {
    console.error("Password reset failed", error);
    return res.status(500).json({ message: "No se pudo cambiar la contraseña." });
  }
}
