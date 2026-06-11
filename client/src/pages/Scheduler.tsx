import { useState, useEffect } from "react";
import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarDaysIcon, CalendarIcon, ClockIcon, SendIcon, Trash2Icon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Scheduler = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/posts");
      setPosts(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this scheduled post?")) {
      return;
    }
    try {
      await api.delete(`/api/posts/${postId}`);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    (async () => await fetchPosts())();
    const interval = setInterval(async () => await fetchPosts(), 10000);
    return () => clearInterval(interval);
  }, []);

  const scheduled = posts.filter((p) => p.status === "scheduled");
  const published = posts.filter((p) => p.status === "published");

  const togglePlatform = (id: string) =>
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Select date and time");
      return;
    }
    if (selectedPlatforms.includes("instagram") && !mediaFile) {
      toast.error("Instagram requires an image or video");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("scheduledFor", scheduledFor);
    formData.append("status", "scheduled");
    formData.append("platforms", JSON.stringify(selectedPlatforms));
    if (mediaFile) formData.append("media", mediaFile);

    setLoading(true);
    try {
      await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post scheduled!");
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
      fetchPosts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full transition-colors duration-200">
      {/* Compose panel */}
      <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-slate-800 dark:text-zinc-100 font-semibold">Compose Post</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSchedule}>
            {/* Platforms */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
                Platforms
              </label>

              <div className="flex flex-wrap gap-2.5">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-1.5 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                        active
                          ? "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-900 text-red-500 dark:text-red-400 scale-105"
                          : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-700 dark:hover:text-zinc-200"
                      }`}
                    >
                      <p.icon className="size-4.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Content
              </label>

              <textarea
                required
                rows={5}
                placeholder="What do you want to share today?"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-900 dark:text-zinc-100 text-sm placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-slate-300 dark:focus:border-zinc-700 transition resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div
                className={`text-right text-xs mt-1 font-medium ${
                  content.length > 270
                    ? "text-red-500"
                    : "text-slate-400 dark:text-zinc-500"
                }`}
              >
                {content.length}/280
              </div>
            </div>

            {/* Media upload */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Media (optional)
              </label>
              {mediaFile ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="preview"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mediaFile)}
                      className="w-full h-40 object-cover"
                      controls
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="absolute top-2.5 right-2.5 size-7 bg-slate-900/60 dark:bg-black/60 hover:bg-slate-900/80 dark:hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-5 py-10 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl cursor-pointer hover:border-red-300 dark:hover:border-red-900/40 hover:bg-red-50/20 dark:hover:bg-red-950/10 transition-all group">
                  <span className="text-sm text-slate-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    Click to upload image or video
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && setMediaFile(e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Date
                </label>
                <div className="relative">
                  <CalendarIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 text-sm outline-none focus:border-slate-300 dark:focus:border-zinc-700"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Time
                </label>
                <div className="relative">
                  <ClockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="time"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 text-sm outline-none focus:border-slate-300 dark:focus:border-zinc-700"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 active:scale-[0.99] disabled:opacity-60 transition-all text-white rounded-xl font-medium cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  Schedule Post
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Queue panel */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Upcoming */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50">
            <CalendarDaysIcon className="size-4.5 text-slate-500 dark:text-zinc-400" />
            <h3 className="text-slate-900 dark:text-zinc-100 font-medium text-sm">Upcoming</h3>
            <span className="ml-auto text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-zinc-700/50">
              {scheduled.length}
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60">
            {scheduled.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-zinc-500 text-sm">
                No posts scheduled yet
              </div>
            ) : (
              scheduled.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-4 hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        return meta ? (
                          <meta.icon
                            key={pl}
                            className="size-3.5 text-slate-400 dark:text-zinc-500"
                          />
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {post.mediaType && (
                        <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                          {post.mediaType}
                        </span>
                      )}

                      <span className="text-xs text-slate-400 dark:text-zinc-500">
                        {new Date(post.scheduledFor).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(post._id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded-md transition-colors cursor-pointer ml-1"
                        title="Delete scheduled post"
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 max-w-xl leading-relaxed">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published posts */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50">
            <SendIcon className="size-4 text-slate-500 dark:text-zinc-400" />
            <h3 className="text-slate-900 dark:text-zinc-100 font-medium text-sm">Published</h3>
            <span className="ml-auto text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-zinc-700/50">
              {published.length}
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60">
            {published.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-zinc-500 text-sm">
                No published posts yet
              </div>
            ) : (
              published.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-4 hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        return meta ? (
                          <meta.icon
                            key={pl}
                            className="size-3.5 text-slate-400 dark:text-zinc-500"
                          />
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {post.mediaType && (
                        <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                          {post.mediaType}
                        </span>
                      )}

                      <span className="text-xs text-slate-400 dark:text-zinc-500">
                        {new Date(post.updatedAt || post.scheduledFor).toLocaleString()}
                      </span>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/40 px-2 py-0.5 rounded-full font-medium">
                        Published
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 max-w-xl leading-relaxed">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;