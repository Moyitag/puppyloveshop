import fetch from "node-fetch";
import { config } from "../config.js";
import salesModel from "../models/sales.js";

//Array de funciones
const wompiController = {};

//Generar token de acceso a la API de Wompi
wompiController.generarToken = async (req, res) => {
  try {
    const response = await fetch("https://id.wompi.sv/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: config.wompi.grant_type,
        audience: config.wompi.audience,
        client_id: config.wompi.client_id,
        client_secret: config.wompi.client_secret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Transacción de prueba (tokenizada, sin 3Ds)
wompiController.paymentTest = async (req, res) => {
  try {
    const { token, formData } = req.body;

    const response = await fetch(
      "https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Transacción real con tarjeta (3Ds)
wompiController.payment3ds = async (req, res) => {
  try {
    const { token, formData } = req.body;

    const response = await fetch("https://api.wompi.sv/TransaccionCompra/3Ds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Confirmar el pago de una venta: marca la Sale como "pagado" o "rechazado"
//según la respuesta de Wompi, para dejar sincronizado el carrito con la venta
wompiController.confirmSalePayment = async (req, res) => {
  try {
    const { saleId, wompiStatus } = req.body;

    if (!saleId || !wompiStatus) {
      return res
        .status(400)
        .json({ message: "saleId and wompiStatus are required" });
    }

    const paymentStatus =
      wompiStatus === "AprobadaExitosamente" ? "pagado" : "rechazado";

    const updatedSale = await salesModel.findByIdAndUpdate(
      saleId,
      { paymentStatus },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    return res.status(200).json({ message: "Sale payment updated", sale: updatedSale });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default wompiController;
