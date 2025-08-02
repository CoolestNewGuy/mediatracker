import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import StatsCards from "@/components/StatsCards";
import RecentMediaList from "@/components/RecentMediaList";
import CurrentlyActive from "@/components/CurrentlyActive";
import MediaCatalog from "@/components/MediaCatalog";
import AchievementWidget from "@/components/AchievementWidget";
import AddMediaModal from "@/components/AddMediaModal";
import QuickUpdateSidebar from "@/components/QuickUpdateSidebar";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import type { MediaStats, QuickUpdateItem } from "@/lib/types";
import type { MediaItem, Achievement } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickUpdateOpen, setIsQuickUpdateOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<MediaStats>({
    queryKey: ['/api/stats'],
    enabled: isAuthenticated,
  });

  const { data: recentItems, isLoading: recentLoading, error: recentError } = useQuery<MediaItem[]>({
    queryKey: ['/api/recent'],
    enabled: isAuthenticated,
  });

  const { data: inProgressItems, isLoading: progressLoading, error: progressError } = useQuery<MediaItem[]>({
    queryKey: ['/api/media/in-progress'],
    enabled: isAuthenticated,
  });

  const { data: achievements, isLoading: achievementsLoading, error: achievementsError } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
    enabled: isAuthenticated,
  });

  // Handle authentication errors
  useEffect(() => {
    const errors = [statsError, recentError, progressError, achievementsError].filter(Boolean);
    for (const error of errors) {
      if (error && isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  }, [statsError, recentError, progressError, achievementsError, toast]);

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your media library...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        stats={stats} 
        onAddMedia={() => setIsAddModalOpen(true)} 
        onQuickUpdate={() => setIsQuickUpdateOpen(true)}
        onViewCatalog={() => setIsCatalogOpen(true)} 
      />
      
      <div className="flex-1 flex flex-col">
        <HeaderBar onAddMedia={() => setIsAddModalOpen(true)} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <StatsCards stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Weekly Progress</h3>
                  <select className="bg-surface-2 border border-gray-600 rounded-lg px-3 py-1 text-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>
                
                <div className="h-64 bg-surface-2 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-chart-line text-4xl text-gray-500 mb-4"></i>
                    <p className="text-gray-400">Progress Chart</p>
                    <p className="text-sm text-gray-500">Chart visualization coming soon</p>
                  </div>
                </div>
              </div>

              <RecentMediaList items={recentItems} isLoading={recentLoading} />
            </div>

            <div className="space-y-6">
              <CurrentlyActive 
                items={inProgressItems} 
                isLoading={progressLoading}
                onQuickUpdate={() => setIsQuickUpdateOpen(true)}
              />

              <AchievementWidget 
                achievements={achievements} 
                isLoading={achievementsLoading} 
              />
            </div>
          </div>
        </main>
      </div>

      <AddMediaModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <QuickUpdateSidebar 
        isOpen={isQuickUpdateOpen}
        onClose={() => setIsQuickUpdateOpen(false)}
        items={inProgressItems as QuickUpdateItem[] | undefined}
      />
      
      <MediaCatalog 
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
}
