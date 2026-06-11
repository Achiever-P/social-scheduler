import { useState, useEffect } from "react";
import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarIcon, ClockIcon, HistoryIcon, Loader2Icon, TimerIcon, Wand2Icon, XIcon } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AIComposer = () => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);

  // Scheduling state
  const [activeScheduler, setActiveScheduler] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get("/api/posts/generations");
      setGenerations(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/posts/generate", { prompt, tone, generateImage });
      setGenerations([data, ...generations]);
      setActiveScheduler(data);
      toast.success("Content generated!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!activeScheduler) return;
    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      toast.error("Select date and time");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    setScheduling(true);
    try {
      await api.post("/api/posts", {
        content: activeScheduler.content,
        mediaUrl: activeScheduler.mediaUrl,
        mediaType: activeScheduler.mediaType,
        platforms: selectedPlatforms,
        scheduledFor,
        status: "scheduled",
      });
      toast.success("AI Post scheduled!");
      closeScheduler();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to schedule");
    } finally {
      setScheduling(false);
    }
  };

  const closeScheduler = () => {
    setActiveScheduler(null);
    setSelectedPlatforms([]);
    setScheduledDate("");
    setScheduledTime("");
  };

  const tones = [
    "Professional",
    "Creative",
    "Funny",
    "Minimalist",
    "Excited",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700 transition-colors duration-200">
      {/* Input Section */}
      <div className="space-y-6 text-center mt-20">
        <h1 className="text-3xl text-slate-800 dark:text-zinc-100 font-semibold tracking-tight">
          What should we create today?
        </h1>

        <div className="relative group mt-12">
          <textarea
            className="w-full px-6 py-6 text-slate-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-2xl placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:outline-none focus:border-slate-400 dark:focus:border-zinc-700 transition resize-none h-40 shadow-xs"
            placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="absolute bottom-4 right-2.5 flex items-center gap-3 text-sm">
            <button
              onClick={() => setGenerateImage(!generateImage)}
              className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 text-slate-700 dark:text-zinc-300 py-2 px-3 rounded-lg border border-red-100/40 dark:border-red-950/30 cursor-pointer"
            >
              <span>AI Image</span>

              <div
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  generateImage ? "bg-red-500" : "bg-slate-200 dark:bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none size-4 transform translate-y-0.5 rounded-full bg-white transition ${
                    generateImage ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-zinc-900 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  Generate
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all border cursor-pointer ${
                tone === t
                  ? "bg-red-500 border-red-500 text-white shadow-xs"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:border-slate-350 dark:hover:border-zinc-700 hover:text-slate-700 dark:hover:text-zinc-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generated Posts */}
      <div className="space-y-6 pt-12 border-t border-slate-200 dark:border-zinc-800/80">
        <div className="flex items-center justify-between text-slate-600 dark:text-zinc-350">
          <div className="flex items-center gap-2 font-medium">
            <HistoryIcon className="size-5 text-slate-500 dark:text-zinc-450" />
            <h2 className="text-xl">Recent Generations</h2>
          </div>
          <span className="text-xs font-semibold bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 px-2 py-0.5 rounded-md">
            {generations.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {generations.map((gen) => (
            <div
              key={gen._id}
              className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-850 p-5 hover:border-red-200 dark:hover:border-red-900/50 transition-all relative overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-medium">
                    {new Date(gen.createdAt).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-md border border-red-100/30 dark:border-red-950/30">
                    {gen.tone}
                  </span>
                </div>

                <p className="text-sm text-slate-655 dark:text-zinc-300 line-clamp-3 leading-relaxed flex-1">
                  {gen.content}
                </p>

                {gen.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                    <img
                      src={gen.mediaUrl}
                      alt="Gen"
                      className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveScheduler(gen)}
                    className="flex-1 bg-slate-100 dark:bg-zinc-950 hover:bg-red-500 dark:hover:bg-red-650 hover:text-white text-slate-600 dark:text-zinc-400 text-xs py-2.5 rounded-lg font-medium transition-all cursor-pointer border border-transparent dark:border-zinc-800/40"
                  >
                    Schedule Post
                  </button>
                </div>
              </div>
            </div>
          ))}

          {generations.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
              <div className="size-12 bg-slate-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-200/50 dark:border-zinc-800/60 text-slate-400 dark:text-zinc-500">
                <Wand2Icon className="size-6" />
              </div>
              <p className="text-slate-500 dark:text-zinc-300 font-medium">No content generated yet</p>
              <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
                Try generating some content using the AI composer above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scheduler Modal */}
      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100 dark:border-zinc-850 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50">
              <h3 className="text-slate-900 dark:text-zinc-100 font-semibold text-md">Schedule Generation</h3>
              <button
                onClick={closeScheduler}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors cursor-pointer"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-6 border border-slate-100/50 dark:border-zinc-850/80 space-y-2">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">Prompt</span>
                <p className="text-slate-800 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-medium italic">
                  "{activeScheduler.prompt}"
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-6 border border-slate-100/50 dark:border-zinc-850/80 space-y-4">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">Generated Content</span>
                <p className="text-slate-800 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {activeScheduler.content}
                </p>
                {activeScheduler.mediaUrl && (
                  <img
                    src={activeScheduler.mediaUrl}
                    alt="preview"
                    className="w-full aspect-video object-cover rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm"
                  />
                )}
              </div>
            </div>

            <div className="p-8 bg-slate-50/40 dark:bg-zinc-900/40 border-t border-slate-100 dark:border-zinc-800/80 space-y-6">
              {/* Options */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
                    Select Channels
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {PLATFORMS.map((p) => {
                      const active = selectedPlatforms.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() =>
                            setSelectedPlatforms((prev) =>
                              prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
                            )
                          }
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            active
                              ? "bg-red-500 border-red-500 text-white shadow-sm scale-105"
                              : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 hover:border-slate-350 dark:hover:border-zinc-700 hover:text-slate-600 dark:hover:text-zinc-350"
                          }`}
                        >
                          <p.icon className="size-4.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <CalendarIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-550 pointer-events-none" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-slate-300 dark:focus:border-zinc-700 transition-all"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-550 pointer-events-none" />
                    <input
                      type="time"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-slate-300 dark:focus:border-zinc-700 transition-all"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeScheduler}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-medium transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedule}
                  disabled={scheduling}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 dark:bg-zinc-100 hover:bg-red-500 dark:hover:bg-red-650 hover:text-white dark:text-zinc-900 dark:hover:text-white transition-all text-white font-medium cursor-pointer shadow-sm disabled:opacity-60"
                >
                  {scheduling ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <TimerIcon className="size-4" />
                  )}
                  Schedule Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIComposer;