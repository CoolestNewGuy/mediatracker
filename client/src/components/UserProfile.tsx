import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Settings,
  LogOut,
  Edit,
  Coins,
  Trophy,
  Calendar,
  Check,
  X,
  TrendingUp,
  Star,
  BookOpen,
  Award,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType } from "@shared/schema";

export default function UserProfile() {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/auth/user"],
  });

  const { data: points } = useQuery<{ points: number }>({
    queryKey: ["/api/user/points"],
  });

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname);
    }
  }, [user]);

  const updateNicknameMutation = useMutation({
    mutationFn: async (newNickname: string) => {
      return await apiRequest("PATCH", "/api/user/nickname", { nickname: newNickname });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditingNickname(false);
      toast({
        title: "Nickname Updated",
        description: "Your nickname has been updated successfully.",
      });
    },
  });

  const dailyLoginMutation = useMutation<{ success: boolean; points: number; day: number }>({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/daily-login");
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/user/points"] });
        toast({
          title: "Daily Reward Claimed!",
          description: `You earned ${data.points} points! Day ${data.day}/7 of your weekly cycle.`,
        });
      } else {
        toast({
          title: "Already Claimed",
          description: "You've already claimed your daily reward today. Come back tomorrow!",
          variant: "default",
        });
      }
    },
  });

  const handleSaveNickname = () => {
    if (nickname.trim() && nickname !== user?.nickname) {
      updateNicknameMutation.mutate(nickname.trim());
    } else {
      setIsEditingNickname(false);
    }
  };

  const displayName = user?.nickname || user?.firstName || user?.email || "User";

  // Check and claim daily login on component mount
  useEffect(() => {
    dailyLoginMutation.mutate();
  }, []);

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Points Display */}
        <div className="flex items-center gap-2 bg-surface-2 px-4 py-2 rounded-lg">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-lg">{points?.points || 0}</span>
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span>{displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-surface-2 border-gray-600">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                {isEditingNickname ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="h-8"
                      placeholder="Enter nickname"
                      autoFocus
                      onKeyPress={(e) => e.key === "Enter" && handleSaveNickname()}
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveNickname}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setNickname(user?.nickname || "");
                        setIsEditingNickname(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>{displayName}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingNickname(true)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
              {user?.email && !isEditingNickname && (
                <div className="text-sm text-gray-400 font-normal">{user.email}</div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/api/logout">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[500px] bg-surface-2 border-gray-600">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Account Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span>{user?.email || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span>{user?.firstName || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Points:</span>
                  <span className="font-bold text-yellow-500">{points?.points || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Daily Login Rewards</h4>
              <div className="text-sm text-gray-400">
                Login daily to earn points! Weekly cycle: 20 → 30 → 50 → 100 → 150 → 200 → 300 points
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Google Login</h4>
              {user?.email ? (
                <div className="text-sm text-gray-400">
                  Connected as {user.email}
                </div>
              ) : (
                <Button variant="outline" onClick={() => window.location.href = "/api/login"}>
                  Connect with Google
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}