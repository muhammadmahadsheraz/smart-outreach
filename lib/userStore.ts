import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "users.txt");

export type UserRecord = {
  email: string;
  name: string;
  company?: string;
  passwordHash: string;
};

async function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, "", "utf8");
  }
}

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function readAllUsers(): Promise<UserRecord[]> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const users: UserRecord[] = [];
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as UserRecord;
      if (parsed.email && parsed.passwordHash) {
        users.push(parsed);
      }
    } catch {
      // ignore bad line
    }
  }
  return users;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const users = await readAllUsers();
  const lower = email.toLowerCase();
  return users.find((u) => u.email.toLowerCase() === lower) ?? null;
}

export async function createUser(params: {
  email: string;
  name: string;
  company?: string;
  password: string;
}): Promise<UserRecord> {
  const existing = await findUserByEmail(params.email);
  if (existing) {
    throw new Error("User already exists");
  }

  const record: UserRecord = {
    email: params.email,
    name: params.name,
    company: params.company,
    passwordHash: hashPassword(params.password),
  };

  await ensureDbFile();
  const line = JSON.stringify(record);
  await fs.appendFile(DB_PATH, line + "\n", "utf8");
  return record;
}

export async function verifyUser(email: string, password: string): Promise<UserRecord | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const hash = hashPassword(password);
  if (hash !== user.passwordHash) return null;
  return user;
}

