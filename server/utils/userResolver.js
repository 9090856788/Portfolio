import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import { DataStore } from "../data/store.js";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * Resolves the target user ID for a request:
 * 1. If `username` is passed in params or query -> find that user's ID
 * 2. If no `username`, check Authorization header or cookie token -> return authenticated user's ID
 * 3. If unauthenticated and no username -> return null (strict isolation / empty state)
 */
export async function resolveTargetUserId(req) {
  const username = req.params?.username || req.query?.username;

  if (username) {
    const clean = String(username).toLowerCase().trim();
    if (isDbConnected()) {
      const user = await User.findOne({
        $or: [
          { email: clean },
          { email: new RegExp(`^${clean}@`, "i") },
          { fullName: new RegExp(`^${clean}$`, "i") },
        ],
      });
      if (user) return String(user._id);
      if (mongoose.isValidObjectId(clean)) {
        const byId = await User.findById(clean);
        if (byId) return String(byId._id);
      }
    }

    const dsUser = DataStore.getUserByUsername ? DataStore.getUserByUsername(username) : null;
    if (dsUser && (dsUser._id || dsUser.id)) {
      return String(dsUser._id || dsUser.id);
    }
    return null;
  }

  // Check authenticated user session
  const authHeader = req.headers?.authorization;
  const cookieToken = req.cookies?.token;
  const token = (authHeader && authHeader.startsWith("Bearer "))
    ? authHeader.split(" ")[1]
    : cookieToken;

  if (token && token !== "demo_admin_jwt_token_2026") {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || "portfolio_dev_secret_key_2026"
      );
      if (decoded && (decoded.id || decoded._id)) {
        return String(decoded.id || decoded._id);
      }
    } catch (_) {
      // Invalid/expired token
    }
  }

  return null;
}
