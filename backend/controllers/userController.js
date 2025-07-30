import userModel from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "user doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      const { password: pw, ...safeUser } = user._doc;
      res.json({ success: true, user: safeUser, token });
    } else {
      res.status(401).json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(409).json({ success: false, message: "user exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = createToken(user._id);

    const { password: pw, ...safeUser } = user._doc;
    res.json({ success: true, user: safeUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser };
