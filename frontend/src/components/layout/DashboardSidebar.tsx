import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  ChevronLeft,
  Plus,
  ClipboardList,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'GESTOR', 'CODER'],
  },
  {
    label: 'Vacantes',
    href: '/dashboard/vacancies',
    icon: Briefcase,
    roles: ['ADMIN', 'GESTOR', 'CODER'],
  },
  {
    label: 'Crear Vacante',
    href: '/dashboard/vacancies/create',
    icon: Plus,
    roles: ['ADMIN', 'GESTOR'],
  },
  {
    label: 'Mis Postulaciones',
    href: '/dashboard/applications',
    icon: FileText,
    roles: ['CODER'],
  },
  {
    label: 'Todas las Postulaciones',
    href: '/dashboard/applications/all',
    icon: ClipboardList,
    roles: ['ADMIN', 'GESTOR'],
  },
  {
    label: 'Usuarios',
    href: '/dashboard/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    label: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['ADMIN', 'GESTOR', 'CODER'],
  },
];

export function DashboardSidebar({ isOpen, onToggle, isMobile }: DashboardSidebarProps) {
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredNavItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-card border-r border-border transition-all duration-300',
        isOpen ? 'w-64' : 'w-20',
        isMobile && 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-primary flex-shrink-0">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          {(isOpen || isMobile) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-display font-bold text-foreground whitespace-nowrap overflow-hidden"
            >
              EmpleaPro
            </motion.span>
          )}
        </Link>
        
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn('hidden lg:flex', !isOpen && 'rotate-180')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-foreground')} />
              {(isOpen || isMobile) && (
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Role Badge */}
      {(isOpen || isMobile) && user && (
        <div className="p-4 border-t border-border">
          <div className="px-3 py-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Rol actual</p>
            <p className="font-semibold text-foreground">{user.role}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
