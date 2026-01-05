import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';

export default function Settings() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: {
      email: true,
      push: false,
      applications: true,
      vacancies: true,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
    },
    theme: theme,
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  const settingSections = [
    {
      title: 'Profile',
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="px-3 py-2 bg-muted rounded-lg text-muted-foreground">
              {user?.role} (Cannot be changed)
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, email: checked }
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Application Updates</p>
              <p className="text-sm text-muted-foreground">Get notified about application status changes</p>
            </div>
            <Switch
              checked={settings.notifications.applications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, applications: checked }
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Vacancies</p>
              <p className="text-sm text-muted-foreground">Get notified about new job postings</p>
            </div>
            <Switch
              checked={settings.notifications.vacancies}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, vacancies: checked }
                }))
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Privacy',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">Make your profile visible to employers</p>
            </div>
            <Switch
              checked={settings.privacy.profileVisible}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ 
                  ...prev, 
                  privacy: { ...prev.privacy, profileVisible: checked }
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Email</p>
              <p className="text-sm text-muted-foreground">Display email address on your profile</p>
            </div>
            <Switch
              checked={settings.privacy.showEmail}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ 
                  ...prev, 
                  privacy: { ...prev.privacy, showEmail: checked }
                }))
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Appearance',
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div>
            <Label>Theme</Label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="w-full mt-2 px-3 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <div className="space-y-6">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <section.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            </div>
            {section.content}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}