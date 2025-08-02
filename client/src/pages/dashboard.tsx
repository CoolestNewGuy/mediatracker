import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from "@/hooks/useKeyboardShortcuts";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import StatsCards from "@/components/StatsCards";
import RecentMediaList from "@/components/RecentMediaList";
import CurrentlyWatched from "@/components/CurrentlyWatched";
import MediaCatalog from "@/components/MediaCatalog";
import StatsOverview from "@/components/StatsOverview";
import SmartCollections from "@/components/SmartCollections";
import AchievementWidget from "@/components/AchievementWidget";
import AddMediaModal from "@/components/AddMediaModal";
import QuickUpdateSidebar from "@/components/QuickUpdateSidebar";
import QuickProgressModal from "@/components/QuickProgressModal";
import RandomPicker from "@/components/RandomPicker";
import UserProfile from "@/components/UserProfile";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { LogOut, User, Sparkles, Trophy, Coins } from "lucide-react";
import type { MediaStats, QuickUpdateItem } from "@/lib/types";
import type { MediaItem, Achievement } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickUpdateOpen, setIsQuickUpdateOpen] = useState(false);
  const [isQuickProgressOpen, setIsQuickProgressOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAddMedia: () => setIsAddModalOpen(true),
    onOpenLibrary: () => setIsCatalogOpen(true),
    onQuickUpdate: () => setIsQuickProgressOpen(true),
    onShowHelp: () => setShowShortcutsHelp(true)
  });

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
        
        <main className="flex-1 overflow-y-auto">
          <div className="container-wide py-8">
            <div className="space-y-6">
              <SmartCollections onOpenCatalog={() => setIsCatalogOpen(true)} />
              <StatsCards stats={stats} />
            </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-8">
            <div className="xl:col-span-3 space-y-6">
              <CurrentlyWatched />
              <RecentMediaList items={recentItems} isLoading={recentLoading} />
            </div>

            <div className="space-y-6">
              <RandomPicker />
              <AchievementWidget 
                achievements={achievements} 
                isLoading={achievementsLoading} 
              />
            </div>
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

      <QuickProgressModal
        isOpen={isQuickProgressOpen}
        onClose={() => setIsQuickProgressOpen(false)}
      />

      <KeyboardShortcutsHelp 
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
}
