import {
  PlusIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UnplugIcon,
} from "lucide-react";

import { PLATFORMS } from "../assets/assets";

interface AccountListProps {
  accounts: any[];
  onDisconnect: (accountId: string) => Promise<void>;
}

const AccountList = ({ accounts, onDisconnect }: AccountListProps) => {
  const handleDisconnect = async (accountId: string) => {
    const confirm = window.confirm("Are you sure you want to disconnect this account?");
    if (!confirm) return;
    await onDisconnect(accountId);
  };

  if (accounts.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center py-20 px-6 shadow-xs">
        <div className="size-14 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 dark:border-zinc-850">
          <PlusIcon className="size-6 text-slate-550 dark:text-zinc-500 opacity-50" />
        </div>
        <p className="text-slate-800 dark:text-zinc-200 text-lg font-medium">No account connected</p>
        <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1.5 max-w-xs text-center leading-relaxed">
          Connect your first social platform to start scheduling and automating your content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {accounts.map((account) => {
        const meta = PLATFORMS.find((p) => p.id === account.platform);
        if (!meta) return null;

        return (
          <div
            key={account._id}
            className="group bg-white dark:bg-zinc-900 border rounded-2xl p-5 flex items-center gap-4 border-slate-200 dark:border-zinc-800 hover:border-slate-350 dark:hover:border-zinc-700 transition-all shadow-xs"
          >
            <div className="size-12 bg-slate-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-zinc-850/60">
              <meta.icon className="size-6 text-slate-550 dark:text-zinc-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-slate-900 dark:text-zinc-100 font-medium truncate">{account.handle}</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{meta.name}</div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {account.status === "connected" ? (
                <>
                  <CheckCircleIcon className="size-4 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-450 font-medium">Connected</span>
                </>
              ) : (
                <>
                  <AlertCircleIcon className="size-4 text-amber-500 dark:text-amber-400" />
                  <span className="text-xs text-amber-600 dark:text-amber-450 font-medium">Disconnected</span>
                </>
              )}
            </div>

            <button
              onClick={() => handleDisconnect(account._id)}
              title="Disconnect account"
              className="ml-2 p-1.5 rounded-lg text-slate-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/20 dark:hover:bg-red-950/20 transition-all cursor-pointer"
            >
              <UnplugIcon className="size-4.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AccountList;