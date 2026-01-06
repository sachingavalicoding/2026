export const authMiddleware = (req, res, next) => {
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next(); 
};