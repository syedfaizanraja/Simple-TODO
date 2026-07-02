import { createHash, randomUUID } from "crypto";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface SessionRecord {
  userId: string;
  name: string;
  email: string;
}

export const router = Router();

const users: UserRecord[] = [];
const sessions = new Map<string, SessionRecord>();

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function createToken() {
  return randomUUID();
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const session = sessions.get(token);

  if (!session) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  (req as Request & { user?: AuthUser }).user = {
    id: session.userId,
    name: session.name,
    email: session.email,
  };

  next();
}

router.post("/signup", (req, res) => {
  const name = req.body?.name?.toString().trim();
  const email = req.body?.email?.toString().trim().toLowerCase();
  const password = req.body?.password?.toString();

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const user: UserRecord = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  const token = createToken();
  sessions.set(token, { userId: user.id, name: user.name, email: user.email });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

router.post("/login", (req, res) => {
  const email = req.body?.email?.toString().trim().toLowerCase();
  const password = req.body?.password?.toString();

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = users.find((record) => record.email === email);

  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = createToken();
  sessions.set(token, { userId: user.id, name: user.name, email: user.email });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

router.get("/me", authenticateUser, (req, res) => {
  const user = (req as Request & { user?: AuthUser }).user;

  res.json({ user });
});
