import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import StatsCards from "@/components/StatsCards";
import RecentMediaList from "@/components/RecentMediaList";
import CurrentlyActive from "@/components/CurrentlyActive";
import MediaCatalog from "@/components/MediaCatalog";
import StatsOverview from "@/components/StatsOverview";
import CatalogPreview from "@/components/CatalogPreview";
import AchievementWidget from "@/components/AchievementWidget";
import AddMediaModal from "@/components/AddMediaModal";
import QuickUpdateSidebar from "@/components/QuickUpdateSidebar";
import RandomPicker from "@/components/RandomPicker";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import type { MediaStats, QuickUpdateItem } from "@/lib/types";
import type { MediaItem, Achievement } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickUpdateOpen, setIsQuickUpdateOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<MediaStats>({
    queryKey: ['/api/stats'],
  });

  const { data: recentItems, isLoading: recentLoading } = useQuery<MediaItem[]>({
    queryKey: ['/api/recent'],
  });

  const { data: inProgressItems, isLoading: progressLoading } = useQuery<MediaItem[]>({
    queryKey: ['/api/media/in-progress'],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your media library...</p>
        </div>
      </div>
    );
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

              <CatalogPreview onOpenCatalog={() => setIsCatalogOpen(true)} />

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
