import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { hashPassword, verifyPassword, generateApiKey, hashApiKey, requireAuth, requireApiKey, requireGpgSignature } from "./auth";
import { loginSchema, gpgSettingsSchema, insertResumeDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: 7 * 24 * 60 * 60, // 1 week in seconds
    tableName: "sessions",
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    }
  }));

  // Public resume data endpoint
  app.get("/api/resume", async (req, res) => {
    try {
      const data = await storage.getResumeData();
      if (!data) {
        // Return default data from JSON file if no database data exists
        const fs = await import('fs/promises');
        const path = await import('path');
        const resumeJsonPath = path.join(process.cwd(), 'client/src/data/resume.json');
        const defaultData = JSON.parse(await fs.readFile(resumeJsonPath, 'utf-8'));
        return res.json(defaultData);
      }
      res.json(data);
    } catch (error) {
      console.error("Error fetching resume data:", error);
      res.status(500).json({ message: "Failed to fetch resume data" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.isAuthenticated = true;
      
      res.json({ 
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          gpgEnabled: user.gpgEnabled
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        gpgEnabled: user.gpgEnabled,
        hasGpgKey: !!user.gpgPublicKey
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin registration (only if no user exists)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Check if any user already exists (single user system)
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword
      });

      req.session.userId = user.id;
      req.session.isAuthenticated = true;
      
      res.status(201).json({ 
        message: "Registration successful",
        user: {
          id: user.id,
          username: user.username,
          gpgEnabled: user.gpgEnabled
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Admin routes (protected)
  app.get("/api/admin/api-keys", requireAuth, async (req, res) => {
    try {
      const apiKeys = await storage.getUserApiKeys(req.session.userId!);
      res.json(apiKeys);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      res.status(500).json({ message: "Failed to fetch API keys" });
    }
  });

  app.post("/api/admin/api-keys", requireAuth, async (req, res) => {
    try {
      const { keyName } = req.body;
      if (!keyName) {
        return res.status(400).json({ message: "Key name is required" });
      }

      const rawKey = generateApiKey();
      const hashedKey = hashApiKey(rawKey);
      
      const apiKey = await storage.createApiKey({
        keyName,
        hashedKey,
        userId: req.session.userId!,
        isActive: true,
        expiresAt: null
      });

      res.json({ 
        ...apiKey, 
        rawKey // Only returned once during creation
      });
    } catch (error) {
      console.error("Error creating API key:", error);
      res.status(500).json({ message: "Failed to create API key" });
    }
  });

  app.put("/api/admin/gpg-settings", requireAuth, async (req, res) => {
    try {
      const { gpgPublicKey, gpgEnabled } = gpgSettingsSchema.parse(req.body);
      
      const user = await storage.updateUserGpgSettings(
        req.session.userId!,
        gpgPublicKey || null,
        gpgEnabled
      );

      res.json({
        id: user.id,
        username: user.username,
        gpgEnabled: user.gpgEnabled,
        hasGpgKey: !!user.gpgPublicKey
      });
    } catch (error) {
      console.error("Error updating GPG settings:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/admin/resume", requireAuth, async (req, res) => {
    try {
      const resumeData = insertResumeDataSchema.parse(req.body);
      const updated = await storage.upsertResumeData(resumeData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(400).json({ message: "Invalid resume data" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
