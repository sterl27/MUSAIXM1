import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  Shield, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Activity,
  Database,
  Music,
  FileText,
  AlertTriangle,
  TrendingUp,
  Server
} from "lucide-react";

// Admin User Schema
const adminUserSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["user", "admin", "super_admin"]),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// System Settings Schema
const systemSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  allowRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  maxFileSize: z.number().min(1, "Max file size must be at least 1MB"),
  enableAnalytics: z.boolean(),
  maintenanceMode: z.boolean(),
});

type AdminUser = z.infer<typeof adminUserSchema>;
type SystemSettings = z.infer<typeof systemSettingsSchema>;

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalSongs: number;
  totalLyrics: number;
  totalPlaylists: number;
}

interface SystemStats {
  serverUptime: string;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  requestsToday: number;
  errorsToday: number;
}

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'super_admin')) {
      window.location.href = '/';
    }
  }, [isAuthenticated, user]);

  // Fetch system statistics
  const { data: userStats, isLoading: userStatsLoading } = useQuery<UserStats>({
    queryKey: ["/api/admin/stats/users"],
    retry: false,
  });

  const { data: systemStats, isLoading: systemStatsLoading } = useQuery<SystemStats>({
    queryKey: ["/api/admin/stats/system"],
    retry: false,
  });

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  // Fetch system settings
  const { data: settings, isLoading: settingsLoading } = useQuery<SystemSettings>({
    queryKey: ["/api/admin/settings"],
    retry: false,
  });

  // User form
  const userForm = useForm<AdminUser>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "user",
      isActive: true,
    },
  });

  // Settings form
  const settingsForm = useForm<SystemSettings>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: settings || {
      siteName: "Musaix Rap Pro",
      siteDescription: "AI-powered lyrical enhancement platform",
      allowRegistration: true,
      requireEmailVerification: false,
      maxFileSize: 10,
      enableAnalytics: true,
      maintenanceMode: false,
    },
  });

  // Update settings form when data loads
  useEffect(() => {
    if (settings) {
      settingsForm.reset(settings);
    }
  }, [settings, settingsForm]);

  // Create/Update user mutation
  const { mutate: saveUser, isPending: isSavingUser } = useMutation({
    mutationFn: async (userData: AdminUser) => {
      const url = selectedUser ? `/api/admin/users/${selectedUser.id}` : "/api/admin/users";
      const method = selectedUser ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats/users"] });
      setIsUserDialogOpen(false);
      setSelectedUser(null);
      userForm.reset();
      toast({
        title: "Success",
        description: `User ${selectedUser ? 'updated' : 'created'} successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to ${selectedUser ? 'update' : 'create'} user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const { mutate: deleteUser } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update settings mutation
  const { mutate: saveSettings, isPending: isSavingSettings } = useMutation({
    mutationFn: async (settingsData: SystemSettings) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settingsData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setIsSettingsDialogOpen(false);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    userForm.reset({
      ...user,
      password: "", // Don't prefill password
    });
    setIsUserDialogOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    userForm.reset();
    setIsUserDialogOpen(true);
  };

  const onUserSubmit = (data: AdminUser) => {
    saveUser(data);
  };

  const onSettingsSubmit = (data: SystemSettings) => {
    saveSettings(data);
  };

  if (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <UnifiedPageLayout title="Access Denied" description="Admin access required">
        <Card className="musaix-card-border bg-black/50">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-xl mb-2">Access Denied</h2>
            <p className="text-gray-400">You need administrator privileges to access this page.</p>
          </CardContent>
        </Card>
      </UnifiedPageLayout>
    );
  }

  return (
    <UnifiedPageLayout 
      title="Admin Dashboard" 
      description="System administration and user management"
    >
      <div className="space-y-6">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="musaix-card-border bg-black/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
              <Users className="h-4 w-4 text-[#FF4081]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {userStatsLoading ? "..." : userStats?.totalUsers || 0}
              </div>
              <p className="text-xs text-gray-400">
                +{userStats?.newUsersToday || 0} new today
              </p>
            </CardContent>
          </Card>

          <Card className="musaix-card-border bg-black/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-[#AB47BC]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {userStatsLoading ? "..." : userStats?.activeUsers || 0}
              </div>
              <p className="text-xs text-gray-400">
                Currently online
              </p>
            </CardContent>
          </Card>

          <Card className="musaix-card-border bg-black/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Content</CardTitle>
              <Music className="h-4 w-4 text-[#FF4081]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {userStatsLoading ? "..." : (userStats?.totalSongs || 0) + (userStats?.totalLyrics || 0)}
              </div>
              <p className="text-xs text-gray-400">
                Songs & lyrics created
              </p>
            </CardContent>
          </Card>

          <Card className="musaix-card-border bg-black/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">System Health</CardTitle>
              <Server className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {systemStatsLoading ? "..." : "Healthy"}
              </div>
              <p className="text-xs text-gray-400">
                Uptime: {systemStats?.serverUptime || "Unknown"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="users" className="text-white">Users</TabsTrigger>
            <TabsTrigger value="content" className="text-white">Content</TabsTrigger>
            <TabsTrigger value="system" className="text-white">System</TabsTrigger>
            <TabsTrigger value="settings" className="text-white">Settings</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-4">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Button onClick={handleCreateUser} className="musaix-gradient-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-[#FF4081] border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Username</TableHead>
                        <TableHead className="text-white">Email</TableHead>
                        <TableHead className="text-white">Role</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white">Created</TableHead>
                        <TableHead className="text-white text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="text-white font-medium">{user.username}</TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'super_admin' ? 'destructive' : user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.role !== 'super_admin' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => user.id && deleteUser(user.id.toString())}
                                >
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music className="h-5 w-5 text-[#FF4081]" />
                    Songs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {userStats?.totalSongs || 0}
                  </div>
                  <p className="text-sm text-gray-400">Total uploaded songs</p>
                </CardContent>
              </Card>

              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#AB47BC]" />
                    Lyrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {userStats?.totalLyrics || 0}
                  </div>
                  <p className="text-sm text-gray-400">Enhanced lyrics created</p>
                </CardContent>
              </Card>

              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-[#FF4081]" />
                    Playlists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {userStats?.totalPlaylists || 0}
                  </div>
                  <p className="text-sm text-gray-400">User playlists created</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Monitoring */}
          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white">Server Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Uptime:</span>
                    <span className="text-white">{systemStats?.serverUptime || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Memory Usage:</span>
                    <span className="text-white">{systemStats?.memoryUsage || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">CPU Usage:</span>
                    <span className="text-white">{systemStats?.cpuUsage || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Disk Usage:</span>
                    <span className="text-white">{systemStats?.diskUsage || 0}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white">Traffic & Errors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Requests Today:</span>
                    <span className="text-white">{systemStats?.requestsToday || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Errors Today:</span>
                    <span className={`${(systemStats?.errorsToday || 0) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {systemStats?.errorsToday || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Error Rate:</span>
                    <span className="text-white">
                      {systemStats?.requestsToday ? 
                        ((systemStats.errorsToday / systemStats.requestsToday) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">System Settings</CardTitle>
                    <CardDescription>Configure system-wide settings</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsSettingsDialogOpen(true)}
                    className="musaix-gradient-button"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-[#FF4081] border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Site Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Site Name:</span>
                            <span className="text-white">{settings?.siteName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Description:</span>
                            <span className="text-white">{settings?.siteDescription}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">User Settings</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Registration:</span>
                            <Badge variant={settings?.allowRegistration ? "default" : "secondary"}>
                              {settings?.allowRegistration ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Email Verification:</span>
                            <Badge variant={settings?.requireEmailVerification ? "default" : "secondary"}>
                              {settings?.requireEmailVerification ? "Required" : "Optional"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">System Settings</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Max File Size:</span>
                            <span className="text-white">{settings?.maxFileSize}MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Analytics:</span>
                            <Badge variant={settings?.enableAnalytics ? "default" : "secondary"}>
                              {settings?.enableAnalytics ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Maintenance:</span>
                            <Badge variant={settings?.maintenanceMode ? "destructive" : "default"}>
                              {settings?.maintenanceMode ? "Active" : "Normal"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="bg-black border-gray-600">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedUser ? 'Edit User' : 'Create New User'}
              </DialogTitle>
              <DialogDescription>
                {selectedUser ? 'Update user information and permissions' : 'Add a new user to the system'}
              </DialogDescription>
            </DialogHeader>
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={userForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="bg-gray-800 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={userForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" className="bg-gray-800 border-gray-600 text-white" />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        {selectedUser ? 'Leave blank to keep current password' : 'Minimum 6 characters'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={userForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            {user?.role === 'super_admin' && (
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={userForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Active Status</FormLabel>
                          <FormDescription className="text-gray-400">
                            Enable or disable user account
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSavingUser} className="musaix-gradient-button">
                    {isSavingUser ? "Saving..." : (selectedUser ? "Update User" : "Create User")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent className="bg-black border-gray-600 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">System Settings</DialogTitle>
              <DialogDescription>
                Configure system-wide settings and preferences
              </DialogDescription>
            </DialogHeader>
            <Form {...settingsForm}>
              <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={settingsForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="maxFileSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Max File Size (MB)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="bg-gray-800 border-gray-600 text-white" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={settingsForm.control}
                  name="siteDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Site Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="bg-gray-800 border-gray-600 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={settingsForm.control}
                    name="allowRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Allow Registration</FormLabel>
                          <FormDescription className="text-gray-400">
                            Allow new users to register
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="requireEmailVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Email Verification</FormLabel>
                          <FormDescription className="text-gray-400">
                            Require email verification
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={settingsForm.control}
                    name="enableAnalytics"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Enable Analytics</FormLabel>
                          <FormDescription className="text-gray-400">
                            Track usage analytics
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Maintenance Mode</FormLabel>
                          <FormDescription className="text-gray-400">
                            Enable maintenance mode
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSavingSettings} className="musaix-gradient-button">
                    {isSavingSettings ? "Saving..." : "Save Settings"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </UnifiedPageLayout>
  );
}