import administratorModel from "../models/administrator.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginAdministratorController = {};

loginAdministratorController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const administratorFound = await administratorModel.findOne({ email });

    if (!administratorFound) {
      return res.status(404).json({ message: "Administrator not found" });
    }

    if (!administratorFound.status) {
      return res.status(403).json({ message: "Administrator is inactive" });
    }

    const isMatch = await bcrypt.compare(
      password,
      administratorFound.password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    jsonwebtoken.sign(
      {
        id: administratorFound._id,
        userType: "admin",
      },
      config.JWT.secret,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          console.log("error" + error);
          return res.status(500).json({ message: "Internal server error" });
        }

        res.cookie("authCookie", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Login successful" });
      }
    );
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginAdministratorController;
