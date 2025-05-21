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
import { Users, Shield, ListMusic, Settings, User, Plus, Edit, Trash2, FileText, BookOpen, PlusSquare } from "lucide-react";

// Types
interface UserPermissions {
  canCreatePages: boolean;
  canEditPages: boolean;
  canDeletePages: boolean;
  canCreatePosts: boolean;
  canEditPosts: boolean;
  canDeletePosts: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  permissions?: UserPermissions;
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
  role: z.enum(["user", "editor", "admin", "super_admin"], {
    required_error: "Please select a role.",
  }),
  permissions: z.object({
    canCreatePages: z.boolean().default(false),
    canEditPages: z.boolean().default(false),
    canDeletePages: z.boolean().default(false),
    canCreatePosts: z.boolean().default(false),
    canEditPosts: z.boolean().default(false),
    canDeletePosts: z.boolean().default(false),
    canManageUsers: z.boolean().default(false),
    canManageSettings: z.boolean().default(false),
  }).optional(),
});

// Form schema for pages
const pageFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  status: z.enum(["published", "draft"], {
    required_error: "Please select a status.",
  }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Form schema for blog posts
const blogPostFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens.",
  }),
  excerpt: z.string().min(10, {
    message: "Excerpt must be at least 10 characters.",
  }).max(300, {
    message: "Excerpt must not exceed 300 characters."
  }),
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  status: z.enum(["published", "draft"], {
    required_error: "Please select a status.",
  }),
  coverImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Define interfaces for pages and blog posts
interface Page {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: "published" | "draft";
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form for adding/editing users
  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "user",
    },
  });
  
  // Form for adding/editing pages
  const pageForm = useForm<z.infer<typeof pageFormSchema>>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
    },
  });
  
  // Form for adding/editing blog posts
  const postForm = useForm<z.infer<typeof blogPostFormSchema>>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "draft",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Reset form when editing user changes
  useEffect(() => {
    if (editingUser) {
      userForm.reset({
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role as "user" | "editor" | "admin" | "super_admin",
        permissions: editingUser.permissions || {
          canCreatePages: false,
          canEditPages: false,
          canDeletePages: false,
          canCreatePosts: false,
          canEditPosts: false,
          canDeletePosts: false,
          canManageUsers: false,
          canManageSettings: false,
        }
      });
    } else {
      userForm.reset({
        username: "",
        email: "",
        password: "",
        role: "user",
        permissions: {
          canCreatePages: false,
          canEditPages: false,
          canDeletePages: false,
          canCreatePosts: false,
          canEditPosts: false,
          canDeletePosts: false,
          canManageUsers: false,
          canManageSettings: false,
        }
      });
    }
  }, [editingUser, userForm]);
  
  // Reset page form when editing page changes
  useEffect(() => {
    if (editingPage) {
      pageForm.reset({
        title: editingPage.title,
        slug: editingPage.slug,
        content: "",  // We would typically fetch content from API
        status: editingPage.status as "published" | "draft",
        metaTitle: "",
        metaDescription: ""
      });
    } else {
      pageForm.reset({
        title: "",
        slug: "",
        content: "",
        status: "draft",
        metaTitle: "",
        metaDescription: ""
      });
    }
  }, [editingPage, pageForm]);
  
  // Reset post form when editing post changes
  useEffect(() => {
    if (editingPost) {
      postForm.reset({
        title: editingPost.title,
        slug: editingPost.slug,
        excerpt: editingPost.excerpt,
        content: "",  // We would typically fetch content from API
        status: editingPost.status as "published" | "draft",
        coverImage: "",
        metaTitle: "",
        metaDescription: ""
      });
    } else {
      postForm.reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "draft",
        coverImage: "",
        metaTitle: "",
        metaDescription: ""
      });
    }
  }, [editingPost, postForm]);

  // Fetch users
  const { 
    data: users = [], 
    isLoading: usersLoading, 
    error: usersError 
  } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      try {
        // Sample data - would be connected to actual API endpoint
        return [
          { 
            id: 1, 
            username: "admin", 
            email: "admin@example.com", 
            role: "super_admin", 
            permissions: {
              canCreatePages: true,
              canEditPages: true,
              canDeletePages: true,
              canCreatePosts: true,
              canEditPosts: true,
              canDeletePosts: true,
              canManageUsers: true,
              canManageSettings: true
            },
            createdAt: "2023-07-15", 
            lastLogin: "2023-09-10" 
          },
          { 
            id: 2, 
            username: "john_doe", 
            email: "john@example.com", 
            role: "editor", 
            permissions: {
              canCreatePages: true,
              canEditPages: true,
              canDeletePages: false,
              canCreatePosts: true,
              canEditPosts: true,
              canDeletePosts: false,
              canManageUsers: false,
              canManageSettings: false
            },
            createdAt: "2023-07-20", 
            lastLogin: "2023-09-05" 
          },
          { 
            id: 3, 
            username: "jane_doe", 
            email: "jane@example.com", 
            role: "user", 
            permissions: {
              canCreatePages: false,
              canEditPages: false,
              canDeletePages: false,
              canCreatePosts: false,
              canEditPosts: false,
              canDeletePosts: false,
              canManageUsers: false,
              canManageSettings: false
            },
            createdAt: "2023-08-01", 
            lastLogin: "2023-08-28" 
          },
          { 
            id: 4, 
            username: "rapper1", 
            email: "rapper1@example.com", 
            role: "user", 
            createdAt: "2023-08-15" 
          },
          { 
            id: 5, 
            username: "singer42", 
            email: "singer@example.com", 
            role: "user", 
            createdAt: "2023-09-01", 
            lastLogin: "2023-09-01" 
          },
        ] as User[];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    retry: 1,
  });
  
  // Fetch pages
  const {
    data: pages = [],
    isLoading: pagesLoading,
    error: pagesError
  } = useQuery({
    queryKey: ['/api/admin/pages'],
    queryFn: async () => {
      try {
        // Sample data - would be connected to actual API endpoint
        return [
          {
            id: 1,
            title: "Home Page",
            slug: "home",
            status: "published",
            createdBy: 1,
            createdAt: "2023-07-10",
            updatedAt: "2023-08-15"
          },
          {
            id: 2,
            title: "About Us",
            slug: "about",
            status: "published",
            createdBy: 2,
            createdAt: "2023-07-12",
            updatedAt: "2023-08-10"
          },
          {
            id: 3,
            title: "Contact Page",
            slug: "contact",
            status: "published",
            createdBy: 1,
            createdAt: "2023-07-20",
            updatedAt: "2023-07-20"
          },
          {
            id: 4,
            title: "Privacy Policy",
            slug: "privacy",
            status: "draft",
            createdBy: 2,
            createdAt: "2023-08-05",
            updatedAt: "2023-08-05"
          }
        ] as Page[];
      } catch (error) {
        console.error("Error fetching pages:", error);
        throw error;
      }
    },
    retry: 1,
  });
  
  // Fetch blog posts
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError
  } = useQuery({
    queryKey: ['/api/admin/posts'],
    queryFn: async () => {
      try {
        // Sample data - would be connected to actual API endpoint
        return [
          {
            id: 1,
            title: "Getting Started with Lyric Enhancement",
            slug: "getting-started-lyric-enhancement",
            excerpt: "Learn how to enhance your lyrics with our AI-powered tools",
            status: "published",
            createdBy: 1,
            createdAt: "2023-08-01",
            updatedAt: "2023-08-01"
          },
          {
            id: 2,
            title: "Top 10 Music Style Combinations",
            slug: "top-10-music-style-combinations",
            excerpt: "Discover the most interesting music style combinations for your lyrics",
            status: "published",
            createdBy: 2,
            createdAt: "2023-08-15",
            updatedAt: "2023-08-16"
          },
          {
            id: 3,
            title: "Voice Preview Feature Announcement",
            slug: "voice-preview-feature",
            excerpt: "Exciting new voice preview feature is now available",
            status: "published",
            createdBy: 1,
            createdAt: "2023-09-01",
            updatedAt: "2023-09-01"
          },
          {
            id: 4,
            title: "Upcoming Features in 2023",
            slug: "upcoming-features-2023",
            excerpt: "A sneak peek at our product roadmap for the rest of 2023",
            status: "draft",
            createdBy: 1,
            createdAt: "2023-09-10",
            updatedAt: "2023-09-12"
          }
        ] as BlogPost[];
      } catch (error) {
        console.error("Error fetching blog posts:", error);
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

  // Add/edit page mutation
  const addEditPageMutation = useMutation({
    mutationFn: async (pageData: z.infer<typeof pageFormSchema>) => {
      // This would be replaced with actual API call
      console.log("Adding/editing page:", pageData);
      return pageData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      setIsAddPageDialogOpen(false);
      setEditingPage(null);
      toast({
        title: editingPage ? "Page Updated" : "Page Created",
        description: editingPage 
          ? `Page "${pageForm.getValues().title}" has been updated.` 
          : `Page "${pageForm.getValues().title}" has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingPage ? "update" : "create"} page. ${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Add/edit blog post mutation
  const addEditPostMutation = useMutation({
    mutationFn: async (postData: z.infer<typeof blogPostFormSchema>) => {
      // This would be replaced with actual API call
      console.log("Adding/editing blog post:", postData);
      return postData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
      setIsAddPostDialogOpen(false);
      setEditingPost(null);
      toast({
        title: editingPost ? "Blog Post Updated" : "Blog Post Created",
        description: editingPost 
          ? `Blog post "${postForm.getValues().title}" has been updated.` 
          : `Blog post "${postForm.getValues().title}" has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingPost ? "update" : "create"} blog post. ${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Form submission handlers
  const onUserSubmit = (data: z.infer<typeof userFormSchema>) => {
    addEditUserMutation.mutate(data);
  };
  
  const onPageSubmit = (data: z.infer<typeof pageFormSchema>) => {
    addEditPageMutation.mutate(data);
  };
  
  const onPostSubmit = (data: z.infer<typeof blogPostFormSchema>) => {
    addEditPostMutation.mutate(data);
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
              <TabsList className="grid grid-cols-6 mb-6">
                <TabsTrigger value="users" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="pages" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Pages
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Blog Posts
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
                            permissions: {
                              canCreatePages: false,
                              canEditPages: false,
                              canDeletePages: false,
                              canCreatePosts: false,
                              canEditPosts: false,
                              canDeletePosts: false,
                              canManageUsers: false,
                              canManageSettings: false,
                            }
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
                      <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                          <FormField
                            control={userForm.control}
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
                            control={userForm.control}
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
                              control={userForm.control}
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
                            control={userForm.control}
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
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                  </select>
                                </FormControl>
                                <FormDescription>
                                  User role determines base access level
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium">Permissions</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Page Permissions</h5>
                                <FormField
                                  control={userForm.control}
                                  name="permissions.canCreatePages"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="h-4 w-4"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Can Create Pages
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="permissions.canEditPages"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="h-4 w-4"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Can Edit Pages
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="permissions.canDeletePages"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="h-4 w-4"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Can Delete Pages
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Blog Permissions</h5>
                                <FormField
                                  control={form.control}
                                  name="permissions.canCreatePosts"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="h-4 w-4"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Can Create Posts
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="permissions.canEditPosts"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="h-4 w-4"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Can Edit Posts
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="permissions.canDeletePosts"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="h-4 w-4"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Can Delete Posts
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Admin Permissions</h5>
                                <FormField
                                  control={form.control}
                                  name="permissions.canManageUsers"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="h-4 w-4"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Can Manage Users
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="permissions.canManageSettings"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="h-4 w-4"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Can Manage Settings
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
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

              {/* Pages Tab */}
              <TabsContent value="pages" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Page Management</h3>
                  <Dialog open={isAddPageDialogOpen} onOpenChange={setIsAddPageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingPage(null)}>
                        <PlusSquare className="h-4 w-4 mr-2" />
                        Create New Page
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{editingPage ? "Edit Page" : "Create New Page"}</DialogTitle>
                        <DialogDescription>
                          {editingPage 
                            ? "Update the page details below." 
                            : "Fill in the details to create a new page."}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...pageForm}>
                        <form onSubmit={pageForm.handleSubmit(onPageSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={pageForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Page Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="About Us" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={pageForm.control}
                              name="slug"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Slug</FormLabel>
                                  <FormControl>
                                    <Input placeholder="about-us" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    URL-friendly version of the title
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={pageForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <textarea 
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                    placeholder="Page content goes here..."
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={pageForm.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Status</FormLabel>
                                  <FormControl>
                                    <select
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                      {...field}
                                    >
                                      <option value="draft">Draft</option>
                                      <option value="published">Published</option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-4 border-t pt-4">
                            <h4 className="text-sm font-medium">SEO Settings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={pageForm.control}
                                name="metaTitle"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Meta Title</FormLabel>
                                    <FormControl>
                                      <Input placeholder="SEO title (optional)" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Leave blank to use page title
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={pageForm.control}
                                name="metaDescription"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl>
                                      <Input placeholder="SEO description (optional)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              type="button" 
                              onClick={() => setIsAddPageDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {addEditPageMutation.isPending 
                                ? "Saving..." 
                                : (editingPage ? "Update Page" : "Create Page")}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {pagesLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : pagesError ? (
                  <div className="p-6 text-center text-destructive">
                    Error loading pages. Please try again.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Slug</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created By</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pages.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No pages found. Create your first page to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          pages.map((page) => (
                            <TableRow key={page.id}>
                              <TableCell className="font-medium">{page.id}</TableCell>
                              <TableCell>{page.title}</TableCell>
                              <TableCell className="font-mono text-xs">{page.slug}</TableCell>
                              <TableCell>
                                <Badge variant={page.status === "published" ? "default" : "secondary"}>
                                  {page.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {users.find(u => u.id === page.createdBy)?.username || `User #${page.createdBy}`}
                              </TableCell>
                              <TableCell>{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
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
              
              {/* Blog Posts Tab */}
              <TabsContent value="posts" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Blog Post Management</h3>
                  <Button onClick={() => setIsAddPostDialogOpen(true)}>
                    <PlusSquare className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                </div>
                
                {postsLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : postsError ? (
                  <div className="p-6 text-center text-destructive">
                    Error loading blog posts. Please try again.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Slug</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No blog posts found. Create your first post to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          posts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.id}</TableCell>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell className="font-mono text-xs">{post.slug}</TableCell>
                              <TableCell>
                                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                                  {post.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {users.find(u => u.id === post.createdBy)?.username || `User #${post.createdBy}`}
                              </TableCell>
                              <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
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