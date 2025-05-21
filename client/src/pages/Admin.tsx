import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Shield, ListMusic, Settings, User, Plus, Edit, Trash2 } from "lucide-react";

// Types
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

interface SavedLyrics {
  id: number;
  userId: number;
  original: string;
  enhanced: string;
  personaId: string;
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  totalSavedLyrics: number;
  activeUsers: number;
}

// Form schema for adding/editing users
const userFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).optional(),
  role: z.enum(["user", "admin"], {
    required_error: "Please select a role.",
  }),
});

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form for adding/editing users
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  // Reset form when editing user changes
  useEffect(() => {
    if (editingUser) {
      form.reset({
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role as "user" | "admin",
      });
    } else {
      form.reset({
        username: "",
        email: "",
        password: "",
        role: "user",
      });
    }
  }, [editingUser, form]);

  // Fetch users
  const { 
    data: users = [], 
    isLoading: usersLoading, 
    error: usersError 
  } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      try {
        // Temporary mock data - would be replaced with actual API call
        return [
          { id: 1, username: "admin", email: "admin@example.com", role: "admin", createdAt: "2023-07-15", lastLogin: "2023-09-10" },
          { id: 2, username: "john_doe", email: "john@example.com", role: "user", createdAt: "2023-07-20", lastLogin: "2023-09-05" },
          { id: 3, username: "jane_doe", email: "jane@example.com", role: "user", createdAt: "2023-08-01", lastLogin: "2023-08-28" },
          { id: 4, username: "rapper1", email: "rapper1@example.com", role: "user", createdAt: "2023-08-15" },
          { id: 5, username: "singer42", email: "singer@example.com", role: "user", createdAt: "2023-09-01", lastLogin: "2023-09-01" },
        ] as User[];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    retry: 1,
  });

  // Fetch saved lyrics
  const { 
    data: savedLyrics = [], 
    isLoading: lyricsLoading, 
    error: lyricsError 
  } = useQuery({
    queryKey: ['/api/admin/lyrics'],
    queryFn: async () => {
      try {
        // Temporary mock data - would be replaced with actual API call
        return [
          { id: 1, userId: 2, original: "This is a sample lyric", enhanced: "This is an enhanced sample lyric", personaId: "kendrick", createdAt: "2023-08-20" },
          { id: 2, userId: 2, original: "Another lyric for testing", enhanced: "Another enhanced lyric for testing", personaId: "drake", createdAt: "2023-08-22" },
          { id: 3, userId: 3, original: "The third sample lyric", enhanced: "The third enhanced sample lyric", personaId: "jcole", createdAt: "2023-08-25" },
          { id: 4, userId: 5, original: "A fourth lyric example", enhanced: "A fourth enhanced lyric example", personaId: "outkast", createdAt: "2023-09-01" },
        ] as SavedLyrics[];
      } catch (error) {
        console.error("Error fetching saved lyrics:", error);
        throw error;
      }
    },
    retry: 1,
  });

  // Fetch stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      try {
        // Temporary mock data - would be replaced with actual API call
        return {
          totalUsers: 5,
          totalSavedLyrics: 4,
          activeUsers: 3,
        } as UserStats;
      } catch (error) {
        console.error("Error fetching stats:", error);
        throw error;
      }
    },
    retry: 1,
  });

  // Add/edit user mutation
  const addEditUserMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof userFormSchema>) => {
      // This would be replaced with actual API call
      console.log("Adding/editing user:", userData);
      return userData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsAddUserDialogOpen(false);
      setEditingUser(null);
      toast({
        title: editingUser ? "User Updated" : "User Added",
        description: editingUser 
          ? `User ${form.getValues().username} has been updated.` 
          : `User ${form.getValues().username} has been added.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingUser ? "update" : "add"} user. ${error}`,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      // This would be replaced with actual API call
      console.log("Deleting user:", userId);
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "User Deleted",
        description: `User has been deleted.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user. ${error}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof userFormSchema>) => {
    addEditUserMutation.mutate(data);
  };

  // Handle user deletion
  const handleDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <PageLayout title="Admin Dashboard" description="Manage users and system settings">
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Manage users, view analytics, and configure system settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="users" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="lyrics" className="flex items-center">
                  <ListMusic className="h-4 w-4 mr-2" />
                  Saved Lyrics
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingUser(null);
                          form.reset({
                            username: "",
                            email: "",
                            password: "",
                            role: "user",
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                        <DialogDescription>
                          {editingUser 
                            ? "Update the user details below." 
                            : "Fill in the details to add a new user to the system."}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {!editingUser && (
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    {...field}
                                  >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              type="button" 
                              onClick={() => setIsAddUserDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {addEditUserMutation.isPending 
                                ? "Saving..." 
                                : (editingUser ? "Update User" : "Add User")}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {usersLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : usersError ? (
                  <div className="p-6 text-center text-destructive">
                    Error loading users. Please try again.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No users found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.id}</TableCell>
                              <TableCell className="font-medium">{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                {user.lastLogin 
                                  ? new Date(user.lastLogin).toLocaleDateString() 
                                  : "Never"}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => {
                                          setEditingUser(user);
                                          setIsAddUserDialogOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                  </Dialog>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={user.id === 1} // Prevent deleting admin
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Lyrics Tab */}
              <TabsContent value="lyrics" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Saved Lyrics</h3>
                </div>
                
                {lyricsLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : lyricsError ? (
                  <div className="p-6 text-center text-destructive">
                    Error loading lyrics. Please try again.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>Persona</TableHead>
                          <TableHead>Original (Preview)</TableHead>
                          <TableHead>Enhanced (Preview)</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedLyrics.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No saved lyrics found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          savedLyrics.map((lyric) => (
                            <TableRow key={lyric.id}>
                              <TableCell className="font-medium">{lyric.id}</TableCell>
                              <TableCell>{lyric.userId}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{lyric.personaId}</Badge>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {lyric.original}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {lyric.enhanced}
                              </TableCell>
                              <TableCell>{new Date(lyric.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-4">
                <h3 className="text-lg font-semibold">System Statistics</h3>
                
                {statsLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : statsError ? (
                  <div className="p-6 text-center text-destructive">
                    Error loading statistics. Please try again.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stats?.activeUsers || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Saved Lyrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stats?.totalSavedLyrics || 0}</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <h3 className="text-lg font-semibold">System Settings</h3>
                <p className="text-muted-foreground">
                  Configure application settings and manage integration options.
                </p>
                
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Manage external API keys for integration services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">OpenAI API Key</label>
                      <div className="flex gap-2">
                        <Input type="password" value="•••••••••••••••••••••••••" readOnly />
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ElevenLabs API Key</label>
                      <div className="flex gap-2">
                        <Input type="password" value="•••••••••••••••••••••••••" readOnly />
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Maintenance</CardTitle>
                    <CardDescription>
                      Perform maintenance tasks and system operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full sm:w-auto">Clear Cache</Button>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full sm:w-auto">Backup Database</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}