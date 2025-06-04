import { 
  users, 
  artistProfiles,
  playlists,
  type User, 
  type RegisterRequest,
  type ArtistProfile,
  type ArtistProfileRequest,
  type Playlist,
  type PlaylistRequest
} from "@shared/schema";
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

  // Artist Profile operations
  getArtistProfile(userId: number): Promise<ArtistProfile | undefined>;
  upsertArtistProfile(userId: number, profileData: ArtistProfileRequest): Promise<ArtistProfile>;

  // Playlist operations
  getUserPlaylists(userId: number): Promise<Playlist[]>;
  createPlaylist(userId: number, playlistData: PlaylistRequest): Promise<Playlist>;
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

  // Artist Profile operations
  async getArtistProfile(userId: number): Promise<ArtistProfile | undefined> {
    const [profile] = await db
      .select()
      .from(artistProfiles)
      .where(eq(artistProfiles.userId, userId));
    return profile || undefined;
  }

  async upsertArtistProfile(userId: number, profileData: ArtistProfileRequest): Promise<ArtistProfile> {
    const profileId = `profile_${userId}_${Date.now()}`;
    
    // Check if profile exists
    const existingProfile = await this.getArtistProfile(userId);
    
    if (existingProfile) {
      // Update existing profile
      const [updatedProfile] = await db
        .update(artistProfiles)
        .set({
          artistName: profileData.artistName,
          bio: profileData.bio,
          genre: profileData.genre,
          location: profileData.location,
          influences: profileData.influences,
          socialLinks: profileData.socialLinks,
          photos: profileData.photos,
          songs: profileData.songs,
          updatedAt: new Date(),
        })
        .where(eq(artistProfiles.userId, userId))
        .returning();
      return updatedProfile;
    } else {
      // Create new profile
      const [newProfile] = await db
        .insert(artistProfiles)
        .values({
          id: profileId,
          userId,
          artistName: profileData.artistName,
          bio: profileData.bio,
          genre: profileData.genre,
          location: profileData.location,
          influences: profileData.influences,
          socialLinks: profileData.socialLinks,
          photos: profileData.photos,
          songs: profileData.songs,
        })
        .returning();
      return newProfile;
    }
  }

  // Playlist operations
  async getUserPlaylists(userId: number): Promise<Playlist[]> {
    const userPlaylists = await db
      .select()
      .from(playlists)
      .where(eq(playlists.userId, userId));
    
    return userPlaylists;
  }

  async createPlaylist(userId: number, playlistData: PlaylistRequest): Promise<Playlist> {
    const playlistId = `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const [playlist] = await db
      .insert(playlists)
      .values({
        id: playlistId,
        userId,
        name: playlistData.name,
        description: playlistData.description || "",
        songIds: playlistData.songs || [],
      })
      .returning();
    
    return playlist;
  }
}

export const storage = new DatabaseStorage();
