import { users, type User, type RegisterRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: RegisterRequest & { provider?: string; providerId?: string }): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // OAuth operations
  findOrCreateOAuthUser(profile: {
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    provider: string;
    providerId: string;
  }): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: RegisterRequest & { provider?: string; providerId?: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        provider: userData.provider || "local",
        providerId: userData.providerId,
        emailVerified: userData.provider === "google",
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async findOrCreateOAuthUser(profile: {
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    provider: string;
    providerId: string;
  }): Promise<User> {
    // First try to find user by provider ID
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.providerId, profile.providerId));

    if (existingUser) {
      return existingUser;
    }

    // Then try to find by email
    const [emailUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, profile.email));

    if (emailUser) {
      // Link the OAuth account to existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          provider: profile.provider,
          providerId: profile.providerId,
          profileImageUrl: profile.profileImageUrl || emailUser.profileImageUrl,
          emailVerified: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, emailUser.id))
        .returning();
      return updatedUser;
    }

    // Create new user
    const username = profile.email.split('@')[0] + Math.random().toString(36).substring(2, 8);
    return await this.createUser({
      email: profile.email,
      username,
      password: '', // No password for OAuth users
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      provider: profile.provider,
      providerId: profile.providerId,
    });
  }
}

export const storage = new DatabaseStorage();
