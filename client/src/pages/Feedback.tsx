import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { MessageSquarePlusIcon, SendIcon, StarIcon, Trash2Icon, MessageSquareIcon } from "lucide-react";

const getSafeAvatarBg = (bg: string) => {
  if (!bg) return "from-red-400 to-pink-400 bg-gradient-to-br";
  const key = bg.toLowerCase();
  if (key.includes("red") || key.includes("pink-400")) return "from-red-400 to-pink-400 bg-gradient-to-br";
  if (key.includes("pink")) return "from-red-400 to-pink-500 bg-gradient-to-br";
  if (key.includes("violet") || key.includes("purple")) return "from-violet-400 to-purple-500 bg-gradient-to-br";
  if (key.includes("sky") || key.includes("blue")) return "from-sky-400 to-blue-500 bg-gradient-to-br";
  if (key.includes("amber") || key.includes("orange")) return "from-amber-400 to-orange-500 bg-gradient-to-br";
  if (key.includes("emerald") || key.includes("teal")) return "from-emerald-400 to-teal-500 bg-gradient-to-br";
  if (key.includes("fuchsia")) return "from-fuchsia-400 to-pink-500 bg-gradient-to-br";
  return "from-red-400 to-pink-500 bg-gradient-to-br";
};

export default function Feedback() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [pastFeedbacks, setPastFeedbacks] = useState<any[]>([]);

  const fetchPastFeedbacks = async () => {
    try {
      const { data } = await api.get("/api/feedback");
      if (Array.isArray(data)) {
        const userFeedbacks = data.filter((item: any) => item.user === user?._id);
        setPastFeedbacks(userFeedbacks);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }
    try {
      await api.delete(`/api/feedback/${id}`);
      toast.success("Feedback deleted successfully.");
      fetchPastFeedbacks();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete feedback");
    }
  };

  useEffect(() => {
    fetchPastFeedbacks();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !text.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/feedback", { name, role, text, rating });
      toast.success("Thank you! Your feedback has been shared.");
      setRole("");
      setText("");
      setRating(5);
      fetchPastFeedbacks();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center md:text-left space-y-2 mt-8">
        <h1 className="text-3xl text-slate-800 dark:text-zinc-100 font-semibold tracking-tight">
          We'd love to hear from you!
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Share your feedback, feature requests, or experience using Scheduler. Your testimonial will be featured on our homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
            <MessageSquarePlusIcon className="size-5 text-red-500" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-100">Write Feedback</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block mb-1.5 font-medium text-slate-700 dark:text-zinc-300">Name</label>
              <input
                type="text"
                required
                placeholder="Your name"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 outline-none focus:border-red-500 dark:focus:border-red-900 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-slate-700 dark:text-zinc-300">Role / Designation</label>
              <input
                type="text"
                required
                placeholder="e.g. Marketing Manager, Indie Creator"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 outline-none focus:border-red-500 dark:focus:border-red-900 transition"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-slate-700 dark:text-zinc-300">Rating</label>
              <div className="flex gap-1.5 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-all duration-150 cursor-pointer"
                  >
                    <StarIcon
                      className={`size-6 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-zinc-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-slate-700 dark:text-zinc-300">Feedback Message</label>
              <textarea
                required
                rows={4}
                maxLength={200}
                placeholder="What do you think of Scheduler? (Max 200 characters)"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 outline-none focus:border-red-500 dark:focus:border-red-900 transition resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="text-right text-xs mt-1 text-slate-400 dark:text-zinc-500 font-medium">
                {text.length}/200
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 active:scale-[0.99] disabled:opacity-60 transition-all text-white rounded-xl font-medium cursor-pointer shadow-xs"
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Testimonial
                  <SendIcon className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold">Live Preview</h3>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/40 p-6 transition-all flex flex-col gap-4 shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`size-3.5 ${
                    i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-zinc-800"
                  }`}
                />
              ))}
            </div>
            <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed min-h-16 italic">
              {text.trim() ? `"${text}"` : '"Your custom feedback message will be displayed here..."'}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="size-9 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-xs">
                {name.trim() ? name.charAt(0).toUpperCase() : (user?.name?.charAt(0).toUpperCase() || "U")}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                  {name.trim() ? name : (user?.name || "Your Name")}
                </div>
                <div className="text-xs text-slate-400 dark:text-zinc-500 truncate">
                  {role.trim() ? role : "Your Role / Designation"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Feedbacks Section */}
      <div className="border-t border-slate-200 dark:border-zinc-800 pt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <MessageSquareIcon className="size-5 text-red-550" />
            Your Testimonial History
          </h2>
          <span className="text-xs font-semibold bg-slate-100 dark:bg-zinc-800 border border-slate-200/50 dark:border-zinc-700/50 px-2 py-0.5 rounded-md">
            {pastFeedbacks.length} total
          </span>
        </div>

        {pastFeedbacks.length === 0 ? (
          <div className="py-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-center text-slate-400 dark:text-zinc-500 text-sm">
            You haven't submitted any feedback yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastFeedbacks.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-red-200 dark:hover:border-red-900/40 transition-all flex flex-col justify-between gap-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`size-3.5 ${
                            i < item.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200 dark:text-zinc-850"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-605 dark:text-zinc-300 italic leading-relaxed">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className={`size-8 rounded-full ${getSafeAvatarBg(item.avatarBg)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-450 dark:text-zinc-500 truncate">
                        {item.role}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteFeedback(item._id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-450 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    title="Delete feedback"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
