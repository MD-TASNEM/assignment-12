import { verifyToken } from "@/lib/auth";

export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

export function withAdminAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = verifyToken(token);
      const role = req.headers["x-user-role"];

      if (role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      req.userId = decoded.userId;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}
