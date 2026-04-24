import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// Use the app root directory more reliably
const getDbPath = () => {
  // In Next.js, __dirname is not available, so we construct it from import.meta
  // Instead, we'll use process.cwd() but ensure we're in the right place
  const cwd = process.cwd();
  const dbPath = path.join(cwd, "data", "users.txt");
  console.log("📁 Using database path:", dbPath, "cwd:", cwd);
  return dbPath;
};

let DB_PATH: string;

export type UserRecord = {
  email: string;
  name: string;
  company?: string;
  passwordHash: string;
};

async function ensureDbFile() {
  try {
    if (!DB_PATH) {
      DB_PATH = getDbPath();
    }
    
    const dir = path.dirname(DB_PATH);
    console.log("📂 Ensuring directory exists:", dir);
    await fs.mkdir(dir, { recursive: true });
    
    try {
      await fs.access(DB_PATH);
      console.log("✅ Database file exists:", DB_PATH);
    } catch {
      console.log("📄 Creating new database file at:", DB_PATH);
      await fs.writeFile(DB_PATH, "", "utf8");
      console.log("✅ Database file created");
    }
  } catch (err) {
    console.error("❌ Error ensuring DB file:", err);
    throw err;
  }
}

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function readAllUsers(): Promise<UserRecord[]> {
  if (!DB_PATH) {
    DB_PATH = getDbPath();
  }
  
  console.log("📖 Reading users from database...");
  await ensureDbFile();
  
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    console.log(`📊 Found ${lines.length} user records`);

    const users: UserRecord[] = [];
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line) as UserRecord;
        if (parsed.email && parsed.passwordHash) {
          users.push(parsed);
        }
      } catch (err) {
        console.error("⚠️ Skipping invalid line in database:", err);
      }
    }
    return users;
  } catch (err) {
    console.error("❌ Error reading database:", err);
    throw err;
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  try {
    console.log("🔍 Searching for user:", email);
    const users = await readAllUsers();
    const lower = email.toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === lower) ?? null;
    if (found) {
      console.log("✅ User found:", email);
    } else {
      console.log("❌ User not found:", email);
    }
    return found;
  } catch (err) {
    console.error("❌ Error finding user:", err);
    throw err;
  }
}

export async function createUser(params: {
  email: string;
  name: string;
  company?: string;
  password: string;
}): Promise<UserRecord> {
  try {
    if (!DB_PATH) {
      DB_PATH = getDbPath();
    }
    
    console.log("✏️ Creating user:", params.email);
    
    const existing = await findUserByEmail(params.email);
    if (existing) {
      console.error("❌ User already exists:", params.email);
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
    console.log("💾 Writing user to database...");
    await fs.appendFile(DB_PATH, line + "\n", "utf8");
    console.log("✅ User created successfully");
    return record;
  } catch (err) {
    console.error("❌ Error creating user:", err);
    throw err;
  }
}

export async function verifyUser(email: string, password: string): Promise<UserRecord | null> {
  try {
    console.log("🔐 Verifying user:", email);
    const user = await findUserByEmail(email);
    if (!user) {
      console.error("❌ User not found");
      return null;
    }
    const hash = hashPassword(password);
    if (hash !== user.passwordHash) {
      console.error("❌ Invalid password");
      return null;
    }
    console.log("✅ User verified");
    return user;
  } catch (err) {
    console.error("❌ Error verifying user:", err);
    throw err;
  }
}

