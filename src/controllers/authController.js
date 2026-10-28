import User from "../models/User.js";
import { sendWelcomeEmail } from "../services/email/emailService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// export function register(req,res){};
// function register(req,res){};
// export default register;
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const mail = await User.findOne({ email });

    if (mail) {
      return res.status(409).json({
        message: "User is already exists",
      });
    }
    const user = new User({
      fullName: fullName,
      email: email,
      password: password,
      role: "learner",
    });
    await user.save();
    try {
      await sendWelcomeEmail({ to: user.email, fullName: user.fullName });
    } catch {
      console.error('Welcome notification failed');
    }
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error servenue ",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // if(email === undefined || password === undefined){
    //   return res.status(400).json({
    //     message: 'the email and password are reuqired',
    //   })
    // }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "email is not exists please register first",
      });
    }
    if (user.status === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is Inactive"
      });
    }
    const isMatched = await user.isMatched(password);
    if (!isMatched) {
      return res.status(403).json({
        message: "password is not correct",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "login success",
      token,
    });
  } catch (error) {
    res.status(401).json({
      message: "error servenue",
    });
  }
};
export const me = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    res.status(404).json({
      message: "error servenue",
    });
  }
};
