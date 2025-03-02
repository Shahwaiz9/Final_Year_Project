import jwt from "jsonwebtoken";

const Authenticated = (req, res, next) => {
  const auth = req.headers["authorization"];

  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token in required" });
  }
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Error: JWT expired",
    });
  }
};

export default Authenticated;
