import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  Share2Icon,
  TrendingUpIcon,
  ActivityIcon,
  SendIcon,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface Activity {
  _id: string;
  id?: number | string;
  description: string;
  createdAt: string;
}

interface Post {
  status: string;
}

interface Account {
  status: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    scheduled: 0,
    published: 0,
    connectedAccounts: 0,
  });

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postsRes, accountsRes, activityRes] = await Promise.all([
          api.get("/api/posts"),
          api.get("/api/accounts"),
          api.get("/api/activity"),
        ]);

        const posts = postsRes.data as Post[];
        const accounts = accountsRes.data as Account[];

        setStats({
          scheduled: posts.filter((post) => post.status === "scheduled").length,
          published: posts.filter((post) => post.status === "published").length,
          connectedAccounts: accounts.filter(
            (account) => account.status === "connected"
          ).length,
        });

        setActivities(activityRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.scheduled,
      icon: ClockIcon,
      trend: "+2 today",
    },
    {
      label: "Published Posts",
      value: stats.published,
      icon: CheckCircleIcon,
      trend: "All time",
    },
    {
      label: "Connected Accounts",
      value: stats.connectedAccounts,
      icon: Share2Icon,
      trend: "Active",
    },
  ];

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* Welcome Bar */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
          {getGreeting()}, {user?.name || "there"}!
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
          Here's what's happening with your social accounts today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 hover:bg-red-50/30 dark:hover:bg-red-950/10 hover:border-red-200 dark:hover:border-red-900/40 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  {card.label}
                </span>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/40 text-slate-600 dark:text-zinc-400">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-slate-800 dark:text-zinc-100 tabular-nums">
                  {card.value}
                </div>
                <div className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-950/30 shadow-2xs">
                  <TrendingUpIcon className="size-3" />
                  {card.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50">
          <h2 className="text-slate-900 dark:text-zinc-100 font-medium">Recent Activity</h2>
          <span className="text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-zinc-700/50">
            {activities.length} events
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="size-12 bg-slate-100 dark:bg-zinc-950 rounded-xl flex items-center justify-center mb-3 border border-slate-200/50 dark:border-zinc-800/40">
              <ActivityIcon className="size-6 text-slate-400 dark:text-zinc-500" />
            </div>

            <p className="text-slate-500 dark:text-zinc-300 font-medium">No activity yet</p>

            <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1 text-center">
              Connect accounts and schedule posts to see events here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {activities.map((activity) => (
              <div
                key={activity._id || activity.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"
              >
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-slate-200/20 dark:border-zinc-700/20">
                  <SendIcon className="size-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 font-semibold border border-zinc-200/30 dark:border-zinc-750/30">
                      Published
                    </span>

                    <span className="text-xs text-slate-400 dark:text-zinc-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;