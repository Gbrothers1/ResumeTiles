import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as openpgp from 'openpgp';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAuthenticated?: boolean;
  }
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashApiKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

export const verifyGpgSignature = async (message: string, signature: string, publicKey: string): Promise<boolean> => {
  try {
    const publicKeyObj = await openpgp.readKey({ armoredKey: publicKey });
    const messageObj = await openpgp.createMessage({ text: message });
    const signatureObj = await openpgp.readSignature({ armoredSignature: signature });
    
    const verificationResult = await openpgp.verify({
      message: messageObj,
      signature: signatureObj,
      verificationKeys: publicKeyObj
    });
    
    const { verified } = verificationResult.signatures[0];
    await verified;
    return true;
  } catch (error) {
    console.error('GPG verification failed:', error);
    return false;
  }
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

export const requireApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({ message: 'API key required' });
  }
  
  try {
    const hashedKey = hashApiKey(apiKey);
    const keyRecord = await storage.getApiKeyByHash(hashedKey);
    
    if (!keyRecord || !keyRecord.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive API key' });
    }
    
    if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
      return res.status(401).json({ message: 'API key expired' });
    }
    
    // Store the key record for potential GPG verification
    (req as any).apiKeyRecord = keyRecord;
    next();
  } catch (error) {
    console.error('API key verification failed:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

export const requireGpgSignature = async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-gpg-signature'] as string;
  const apiKeyRecord = (req as any).apiKeyRecord;
  
  if (!signature) {
    return res.status(401).json({ message: 'GPG signature required' });
  }
  
  if (!apiKeyRecord?.adminUserId) {
    return res.status(401).json({ message: 'Invalid API key context' });
  }
  
  try {
    const user = await storage.getUser(apiKeyRecord.adminUserId);
    
    if (!user?.gpgEnabled || !user.gpgPublicKey) {
      return res.status(401).json({ message: 'GPG not enabled for this user' });
    }
    
    // Create message to verify (method + url + body)
    const message = `${req.method}${req.originalUrl}${JSON.stringify(req.body)}`;
    
    const isValid = await verifyGpgSignature(message, signature, user.gpgPublicKey);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid GPG signature' });
    }
    
    next();
  } catch (error) {
    console.error('GPG signature verification failed:', error);
    return res.status(500).json({ message: 'Signature verification error' });
  }
};