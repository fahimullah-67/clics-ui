import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Activity,
  ArrowLeft,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import api from "../utils/axios";
import { timeAgo } from "../utils/timeAgo";

export default function UsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: "",
  });

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoader(true);
      try {
        const res = await api.get("/all-user");
        console.log("Fetched users:", res);
        const formatted = res.data?.data?.map((u) => ({
          id: u._id,
          name: u.username || "N/A",
          email: u.email || "N/A",
          role: u.role || "user",
          isActive: u.isLoggedIn === true ? "active" : "inactive",
          address: u.address ? `${u.address[2]}, ${u.address[1]}, ${u.address[0]}` : "N/A",
          lastLogin: timeAgo(u.lastLoginAt) || "N/A",
        }));
        console.log("formatted data", formatted);
        
        setUsers(formatted || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoader(false);
      }
    };

    fetchUsers();
  }, []);

  
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "user",
      isActive: true,
    });
  };

  // Save user changes
  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setLoader(true);
      const res = await api.put("/update-user-profile/admin", {formData});
      console.log("User updated:", res);

      // Update local state
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                isActive: formData.isActive,
              }
            : u,
        ),
      );

      handleCloseModal();
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user");
    } finally {
      setLoader(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoader(true);
      await api.delete("/user-delete", { data: { userId } });
      console.log("User deleted");

      // Update local state
      setUsers(users.filter((u) => u.id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    } finally {
      setLoader(false);
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loader && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-lg text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => navigate("/admin")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                User Management
              </h1>
              <p className="text-muted-foreground text-lg">
                View and manage all users in the system
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {error && (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="pt-6">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Users ({filteredUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="6" className="text-center py-6">
                        <p className="text-muted-foreground">No users found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.isActive === "active" ? "default" : "secondary"}
                          >
                            {u.isActive === "active" ? "active" : "inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {u.address ? u.address : "N/A"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {u.lastLogin}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(u)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button> */}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(u.id)}
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
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={loader}>
              {loader ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
