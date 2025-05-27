import User from '../models/user-model.js';


const auth = async (req, res, next) => {
  try {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    
    const user = await User.findOne({ token });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default auth;
