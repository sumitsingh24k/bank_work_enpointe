import jwt from "jsonwebtoken";
import Usermodel from "../Schema/Userschema.js";


const secretkey = "yeeeyedueudouoidieocjojciodkcjl";


export const Registercontroller = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;


    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

  
    const newUser = new Usermodel({
      name,
      email,
      password,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const Logincontroller = async (req, res) => {
  try {
    const { email, password, role } = req.body;


    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const user = await Usermodel.findOne({ email, password, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

   
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secretkey,
      { expiresIn: "1h" } 
    );

    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
