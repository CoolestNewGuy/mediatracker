import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import AddMediaModal from "@/components/AddMediaModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Bell, Database, Palette, Download, Trash2, Shield } from "lucide-react";
import type { MediaStats } from "@/lib/types";

export default function SettingsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [notifications, setNotifications] = useState({
    newAchievements: true,
    completionReminders: false,
    weeklyStats: true,
  });
  
  const { toast } = useToast();

  const { data: stats } = useQuery<MediaStats>({
    queryKey: ['/api/stats'],
  });

  const handleExportData = () => {
    // TODO: Implement data export
    toast({
      title: "Export Started",
      description: `Your data will be exported in ${exportFormat.toUpperCase()} format.`,
    });
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      // TODO: Implement data clearing
      toast({
        title: "Feature Coming Soon",
        description: "Data clearing functionality will be available soon.",
      });
    }
  };

  const handleSaveSettings = () => {
    // TODO: Implement settings save
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        stats={stats}
        onAddMedia={() => setIsAddModalOpen(true)}
        onQuickUpdate={() => {}}
        onViewCatalog={() => {}}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <HeaderBar onAddMedia={() => setIsAddModalOpen(true)} />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-[#7A1927]" />
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-400 mt-1">
                  Manage your account and application preferences
                </p>
              </div>
            </div>

            {/* Profile Settings */}
            <Card className="bg-surface-2 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
                <CardDescription>
                  Your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      defaultValue="default-user"
                      className="bg-surface border-gray-600"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      defaultValue="user@example.com"
                      className="bg-surface border-gray-600"
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="bg-surface border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface-2 border-gray-600">
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="jst">Japan Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-surface-2 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="achievement-notifications">Achievement Notifications</Label>
                    <p className="text-sm text-gray-400">Get notified when you unlock new achievements</p>
                  </div>
                  <Switch
                    id="achievement-notifications"
                    checked={notifications.newAchievements}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, newAchievements: checked }))
                    }
                  />
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="completion-reminders">Completion Reminders</Label>
                    <p className="text-sm text-gray-400">Remind you to update progress on ongoing media</p>
                  </div>
                  <Switch
                    id="completion-reminders"
                    checked={notifications.completionReminders}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, completionReminders: checked }))
                    }
                  />
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-stats">Weekly Statistics</Label>
                    <p className="text-sm text-gray-400">Receive weekly summaries of your progress</p>
                  </div>
                  <Switch
                    id="weekly-stats"
                    checked={notifications.weeklyStats}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, weeklyStats: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-surface-2 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Export or manage your media tracking data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Data Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-surface rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-[#7A1927]">{stats?.total || 0}</div>
                    <div className="text-sm text-gray-400">Total Items</div>
                  </div>
                  <div className="text-center p-4 bg-surface rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-green-500">
                      {Object.values(stats?.byStatus || {}).reduce((sum: number, count: any) => 
                        sum + (count === 'Watched' || count === 'Read' ? 1 : 0), 0)}
                    </div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-surface rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-blue-500">
                      {Object.keys(stats?.byType || {}).length}
                    </div>
                    <div className="text-sm text-gray-400">Media Types</div>
                  </div>
                  <div className="text-center p-4 bg-surface rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-purple-500">
                      {Object.keys(stats?.byGenre || {}).length}
                    </div>
                    <div className="text-sm text-gray-400">Genres</div>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Export Data */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="export-format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger className="bg-surface border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-surface-2 border-gray-600">
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleExportData}
                    className="bg-[#7A1927] hover:bg-[#9d2332]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <Separator className="bg-gray-700" />

                {/* Danger Zone */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                  </div>
                  
                  <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-400">Clear All Data</h4>
                        <p className="text-sm text-gray-400">
                          Permanently delete all your media tracking data. This action cannot be undone.
                        </p>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={handleClearData}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Preferences */}
            <Card className="bg-surface-2 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Application Preferences
                </CardTitle>
                <CardDescription>
                  Customize how the application looks and behaves
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger className="bg-surface border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface-2 border-gray-600">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="default-view">Default Library View</Label>
                  <Select defaultValue="grid">
                    <SelectTrigger className="bg-surface border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface-2 border-gray-600">
                      <SelectItem value="grid">Grid View</SelectItem>
                      <SelectItem value="list">List View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="items-per-page">Items Per Page</Label>
                  <Select defaultValue="24">
                    <SelectTrigger className="bg-surface border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface-2 border-gray-600">
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                      <SelectItem value="96">96</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                className="bg-[#7A1927] hover:bg-[#9d2332]"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>

      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}