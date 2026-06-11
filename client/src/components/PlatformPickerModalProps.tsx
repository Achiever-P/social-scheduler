import { CheckCircleIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface PlatformPickerModalProps {
  connectedIds: string[];
  connecting: string | null;
  onClose: () => void;
  onConnect: (platformId: string) => void;
}

const PlatformPickerModal = ({
  connectedIds,
  connecting,
  onClose,
  onConnect,
}: PlatformPickerModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-zinc-850 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <h3 className="text-slate-800 dark:text-zinc-100 font-semibold text-md">Choose a Platform</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
          >
            <XIcon className="size-4.5" />
          </button>
        </div>

        {/* Platform list */}
        <div className="p-6 flex flex-col gap-2.5">
          {PLATFORMS.map((p) => {
            const isConnected = connectedIds.includes(p.id);
            const isConnecting = connecting === p.id;

            return (
              <button
                key={p.id}
                disabled={isConnected || isConnecting}
                onClick={() => onConnect(p.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  isConnected
                    ? "border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/10 cursor-default"
                    : "border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-900/60 cursor-pointer"
                } ${isConnecting ? "opacity-60" : ""}`}
              >
                {/* Icon */}
                <div className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/60 flex items-center justify-center shrink-0">
                  <p.icon
                    className={`size-5 ${
                      isConnected ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-zinc-400"
                    }`}
                  />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      isConnected ? "text-red-700 dark:text-red-400" : "text-slate-800 dark:text-zinc-200"
                    }`}
                  >
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-500 truncate mt-0.5">
                    {isConnected ? "Already connected" : p.description}
                  </div>
                </div>

                {/* Status */}
                {isConnected && (
                  <CheckCircleIcon className="size-4.5 shrink-0 text-red-500 dark:text-red-400" />
                )}

                {isConnecting && (
                  <div className="size-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin shrink-0" />
                )}

                {!isConnected && !isConnecting && (
                  <ExternalLinkIcon className="size-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlatformPickerModal;