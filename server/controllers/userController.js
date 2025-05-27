import User from '../models/user-model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
  
    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });
    
   
    await newUser.save();
    
    
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email
    };
    
    return res.status(201).json({ 
      message: "User registered successfully", 
      user: userResponse 
    });
  } catch (error) {
    console.error("Register error:", error);
    
    
    if (error.code === 11000) {
      
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    return res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
   
    const isEmail = username.includes('@');
    let user;
    
    if (isEmail) {
      
      user = await User.findOne({ email: username });
    } else {
      
      user = await User.findOne({ username });
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
   
    const token = crypto.randomBytes(48).toString('hex');
    
    
    user.token = token;
    await user.save();
    
    
    return res.status(200).json({ 
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Server error retrieving profile" });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email } = req.body;
    
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    
    if (username) user.username = username;
    if (email) user.email = email;
    
    
    await user.save();
    
    return res.status(200).json({ 
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error updating profile" });
  }
};


export const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    
   
    const user = await User.findById(userId);
    if (user) {
      user.token = null;
      await user.save();
    }
    
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error during logout" });
  }
};
