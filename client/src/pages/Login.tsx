import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, LockIcon, ArrowRightIcon, User2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Login() {
  const [loginState, setLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(
        `/api/auth/${loginState ? "login" : "register"}`,
        { name, email, password }
      );

      login(data, data.token);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-slate-100 dark:border-zinc-800/80">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="size-6.5" />
              <h1 className="text-2xl text-slate-900 dark:text-zinc-100 font-bold">Scheduler</h1>
            </Link>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Sign in to your Dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            {!loginState && (
              <div>
                <label className="block mb-1.5 text-slate-700 dark:text-zinc-300 font-medium">Name</label>
                <div className="relative">
                  <User2Icon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-full text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-350 dark:focus:border-zinc-700 transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block mb-1.5 text-slate-700 dark:text-zinc-300 font-medium">Email</label>
              <div className="relative">
                <MailIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-full text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-350 dark:focus:border-zinc-700 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-slate-700 dark:text-zinc-300 font-medium">Password</label>
              <div className="relative">
                <LockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="********"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-full text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-350 dark:focus:border-zinc-700 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  {loginState ? "Sign In" : "Sign Up"}{" "}
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
            {loginState ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setLoginState(false)}
                  className="text-red-650 dark:text-red-400 font-medium hover:text-red-750 dark:hover:text-red-300 cursor-pointer"
                >
                  Create one free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setLoginState(true)}
                  className="text-red-650 dark:text-red-400 font-medium hover:text-red-750 dark:hover:text-red-300 cursor-pointer"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
