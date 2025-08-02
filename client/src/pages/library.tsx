import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import MediaLibrary from "@/components/MediaLibrary";
import AddMediaModal from "@/components/AddMediaModal";
import { useQuery } from "@tanstack/react-query";
import type { MediaStats } from "@/lib/types";

export default function Library() {
  const [location] = useLocation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Extract media type from URL if present
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const selectedType = urlParams.get('type') || undefined;

  const { data: stats } = useQuery<MediaStats>({
    queryKey: ['/api/stats'],
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        stats={stats}
        onAddMedia={() => setIsAddModalOpen(true)}
        onQuickUpdate={() => {}}
        onViewCatalog={() => {}}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <HeaderBar />
        
        <main className="flex-1 p-6">
          <MediaLibrary 
            onAddMedia={() => setIsAddModalOpen(true)}
            selectedType={selectedType}
          />
        </main>
      </div>

      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}