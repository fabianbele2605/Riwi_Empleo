import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, MoreHorizontal, Shield, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';

const roleColors = {
  ADMIN: 'bg-destructive/10 text-destructive',
  GESTOR: 'bg-primary/10 text-primary',
  CODER: 'bg-success/10 text-success',
};

export default function Users() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.getUsers();
        setUsers(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [user]);

  const filteredUsers = users.filter(u => {
    if (searchTerm && !u.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !u.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (roleFilter && u.role.toUpperCase() !== roleFilter) return false;
    return true;
  });

  if (user?.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Access Denied</h3>
        <p className="text-muted-foreground">Only ADMIN users can access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage system users and their roles
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary"
          >
            <option value="">All roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="GESTOR">GESTOR</option>
            <option value="CODER">CODER</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['ADMIN', 'GESTOR', 'CODER'].map((role) => {
          const count = users.filter(u => u.role.toUpperCase() === role).length;
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border/50"
            >
              <div className={`w-10 h-10 rounded-lg ${roleColors[role as keyof typeof roleColors]} flex items-center justify-center mb-3`}>
                <User className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-sm text-muted-foreground">{role}S</p>
            </motion.div>
          );
        })}
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="bg-card rounded-2xl p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Created</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role.toUpperCase() as keyof typeof roleColors]}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}