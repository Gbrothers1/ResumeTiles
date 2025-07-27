import { type User, type InsertUser, type ResumeData, type InsertResumeData, type ApiKey, type InsertApiKey } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGpgSettings(userId: string, gpgPublicKey: string | null, gpgEnabled: boolean): Promise<User>;
  
  // Resume data operations  
  getResumeData(): Promise<ResumeData | undefined>;
  upsertResumeData(data: InsertResumeData): Promise<ResumeData>;
  
  // API key operations
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  getApiKeyByHash(hashedKey: string): Promise<ApiKey | undefined>;
  getUserApiKeys(userId: string): Promise<ApiKey[]>;
  deactivateApiKey(keyId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumeData: ResumeData | undefined;
  private apiKeys: Map<string, ApiKey>;

  constructor() {
    this.users = new Map();
    this.apiKeys = new Map();
    this.seedDefaultAdmin();
  }

  private async seedDefaultAdmin() {
    // Create default admin user if no users exist
    setTimeout(async () => {
      if (this.users.size === 0) {
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const defaultAdmin: User = {
          id: 'default-admin-id',
          username: 'admin',
          password: hashedPassword,
          gpgPublicKey: null,
          gpgEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.users.set('default-admin-id', defaultAdmin);
        console.log('Default admin user created: username=admin, password=admin123');
      }
    }, 100);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      gpgPublicKey: null,
      gpgEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserGpgSettings(userId: string, gpgPublicKey: string | null, gpgEnabled: boolean): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { 
      ...user, 
      gpgPublicKey, 
      gpgEnabled, 
      updatedAt: new Date() 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getResumeData(): Promise<ResumeData | undefined> {
    return this.resumeData;
  }

  async upsertResumeData(data: InsertResumeData): Promise<ResumeData> {
    const id = this.resumeData?.id || randomUUID();
    this.resumeData = { ...data, id };
    return this.resumeData;
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const id = randomUUID();
    const apiKey: ApiKey = { 
      ...insertApiKey, 
      id,
      isActive: insertApiKey.isActive ?? true,
      userId: insertApiKey.userId ?? null,
      expiresAt: insertApiKey.expiresAt ?? null,
      createdAt: new Date()
    };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }

  async getApiKeyByHash(hashedKey: string): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeys.values()).find(
      (key) => key.hashedKey === hashedKey,
    );
  }

  async getUserApiKeys(userId: string): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(
      (key) => key.userId === userId,
    );
  }

  async deactivateApiKey(keyId: string): Promise<void> {
    const apiKey = this.apiKeys.get(keyId);
    if (apiKey) {
      this.apiKeys.set(keyId, { ...apiKey, isActive: false });
    }
  }
}

export const storage = new MemStorage();
