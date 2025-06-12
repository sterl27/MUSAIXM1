import { 
  users, 
  artistProfiles,
  playlists,
  songs,
  type User, 
  type RegisterRequest,
  type ArtistProfile,
  type ArtistProfileRequest,
  type Playlist,
  type PlaylistRequest,
  type Song,
  type InsertSong
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

  // Song operations
  getUserSongs(userId: number): Promise<Song[]>;
  createSong(userId: number, songData: InsertSong): Promise<Song>;
  getSong(id: string): Promise<Song | undefined>;
  deleteSong(id: string, userId: number): Promise<boolean>;

  // Playlist operations
  getUserPlaylists(userId: number): Promise<Playlist[]>;
  createPlaylist(userId: number, playlistData: PlaylistRequest): Promise<Playlist>;
  addSongToPlaylist(playlistId: string, songId: string): Promise<boolean>;

  // Admin operations
  getUserStats(): Promise<any>;
  getSystemStats(): Promise<any>;
  getAllUsers(): Promise<User[]>;
  createAdminUser(userData: any): Promise<User>;
  updateAdminUser(userId: number, userData: any): Promise<User | null>;
  deleteAdminUser(userId: number): Promise<boolean>;
  getSystemSettings(): Promise<any>;
  updateSystemSettings(settingsData: any): Promise<any>;
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

  async getUserSongs(userId: number): Promise<Song[]> {
    const userSongs = await db.select().from(songs).where(eq(songs.userId, userId));
    return userSongs;
  }

  async createSong(userId: number, songData: InsertSong): Promise<Song> {
    const songId = `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const [song] = await db
      .insert(songs)
      .values({
        id: songId,
        userId,
        ...songData,
      })
      .returning();
    return song;
  }

  async getSong(id: string): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song || undefined;
  }

  async deleteSong(id: string, userId: number): Promise<boolean> {
    const result = await db
      .delete(songs)
      .where(eq(songs.id, id));
    return (result.rowCount || 0) > 0;
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

  async addSongToPlaylist(playlistId: string, songId: string): Promise<boolean> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, playlistId));
    if (!playlist) return false;

    const updatedSongIds = [...(playlist.songIds || []), songId];
    await db
      .update(playlists)
      .set({ songIds: updatedSongIds, updatedAt: new Date() })
      .where(eq(playlists.id, playlistId));
    
    return true;
  }

  // Admin operations
  async getUserStats(): Promise<any> {
    const totalUsers = await db.select().from(users);
    const totalProfiles = await db.select().from(artistProfiles);
    const totalPlaylists = await db.select().from(playlists);
    
    return {
      totalUsers: totalUsers.length,
      activeUsers: totalUsers.filter(user => user.createdAt && 
        new Date(user.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000).length,
      newUsersToday: totalUsers.filter(user => user.createdAt && 
        new Date(user.createdAt).toDateString() === new Date().toDateString()).length,
      totalSongs: totalProfiles.reduce((sum, profile) => {
        const songs = profile.songs;
        return sum + (Array.isArray(songs) ? songs.length : 0);
      }, 0),
      totalLyrics: totalProfiles.length,
      totalPlaylists: totalPlaylists.length,
    };
  }

  async getSystemStats(): Promise<any> {
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    return {
      serverUptime: `${uptimeHours}h ${uptimeMinutes}m`,
      memoryUsage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100),
      cpuUsage: Math.round(Math.random() * 20 + 10), // Simulated CPU usage
      diskUsage: Math.round(Math.random() * 30 + 20), // Simulated disk usage
      requestsToday: Math.round(Math.random() * 1000 + 500),
      errorsToday: Math.round(Math.random() * 10),
    };
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers;
  }

  async createAdminUser(userData: any): Promise<User> {
    const hashedPassword = userData.password ? await import('bcryptjs').then(bcrypt => 
      bcrypt.hash(userData.password, 10)) : undefined;
    
    const [newUser] = await db
      .insert(users)
      .values({
        email: userData.email,
        username: userData.username || userData.email,
        password: hashedPassword,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      })
      .returning();
    
    return newUser;
  }

  async updateAdminUser(userId: number, userData: any): Promise<User | null> {
    const updateData: any = {
      email: userData.email,
      role: userData.role,
    };

    if (userData.password) {
      updateData.password = await import('bcryptjs').then(bcrypt => 
        bcrypt.hash(userData.password, 10));
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser || null;
  }

  async deleteAdminUser(userId: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, userId));
    
    return (result.rowCount ?? 0) > 0;
  }

  async getSystemSettings(): Promise<any> {
    // For now, return default settings since we don't have a settings table
    return {
      siteName: "Musaix Pro",
      siteDescription: "AI-powered lyrical enhancement platform",
      allowRegistration: true,
      requireEmailVerification: false,
      maxFileSize: 10,
      enableAnalytics: true,
      maintenanceMode: false,
    };
  }

  async updateSystemSettings(settingsData: any): Promise<any> {
    // For now, just return the settings as we don't have persistent storage
    // In a real implementation, this would save to a settings table
    return settingsData;
  }
}

export const storage = new DatabaseStorage();
