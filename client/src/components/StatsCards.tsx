import { List, Check, Play, Clock } from "lucide-react";
import type { MediaStats } from "@/lib/types";

interface StatsCardsProps {
  stats?: MediaStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const totalCompleted = (stats?.byStatus?.['Watched'] || 0) + (stats?.byStatus?.['Read'] || 0);
  const completionRate = stats?.total ? Math.round((totalCompleted / stats.total) * 100) : 0;

  const cards = [
    {
      title: "Total Items",
      value: stats?.total || 0,
      subtitle: "+5 this week",
      icon: List,
      color: "bg-red-500/20 text-red-500",
    },
    {
      title: "Completed",
      value: totalCompleted,
      subtitle: `${completionRate}% completion rate`,
      icon: Check,
      color: "bg-green-500/20 text-green-400",
    },
    {
      title: "In Progress",
      value: stats?.inProgressCount || 0,
      subtitle: "Active watching",
      icon: Play,
      color: "bg-red-500/20 text-red-500",
    },
    {
      title: "Time Spent",
      value: "342h",
      subtitle: "This month: 28h",
      icon: Clock,
      color: "bg-blue-500/20 text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-surface rounded-xl p-6 border border-gray-700 hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-green-400 text-sm mt-1">{card.subtitle}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
