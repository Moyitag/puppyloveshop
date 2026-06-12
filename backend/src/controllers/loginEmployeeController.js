import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import employeeModel from "../models/employee.js";
import { config } from "../config.js";

const loginEmployeeController = {};

loginEmployeeController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const userFound = await employeeModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (userFound.activo === "No") {
      return res.status(403).json({ message: "Empleado inactivo" });
    }

    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password || "");
    const isPlainTextMatch = password === userFound.password;

    if (!isMatch && !isPlainTextMatch) {
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      if (userFound.loginAttempts >= 5) {
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttempts = 0;

        await userFound.save();
        return res.status(403).json({ message: "Cuenta bloqueada" });
      }

      await userFound.save();

      return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    userFound.loginAttempts = 0;
    userFound.timeOut = null;

    if (isPlainTextMatch) {
      userFound.password = await bcrypt.hash(password, 10);
    }

    await userFound.save();

    const token = jsonwebtoken.sign(
      { id: userFound._id, userType: "employee" },
      config.jwt.secret || config.JWT.secret,
      { expiresIn: "30d" }
    );

    res.cookie("authCookie", token);

    return res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginEmployeeController;
