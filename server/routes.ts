import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get resume data (for future database integration)
  app.get("/api/resume", async (req, res) => {
    try {
      // For now, this would return static JSON data
      // In the future, this could fetch from database
      res.json({ message: "Resume data endpoint - currently using static JSON" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resume data" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
