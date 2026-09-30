"use client";

import React, { useState } from "react";
import { User } from "@/types";
import { Moon, Sun, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from "lucide-react";

interface AuthViewProps {
  onSuccess: (user: User) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, darkMode, setDarkMode }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isRegister && !username)) {
      setError("Please fill out all required fields");
      return;
    }

    if (isRegister && password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    try {
      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

      if (isRegister) {
        if (users.some((u) => u.email === email)) {
          throw new Error("Email already registered");
        }
        const newUser: User = {
          id: `user-${Date.now()}`,
          username: username.trim(),
          email: email.trim(),
          name: username.trim(),
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        onSuccess(newUser);
      } else {
        const found = users.find((u) => u.email === email);
        const user: User = found || {
          id: `user-${Date.now()}`,
          username: email.split("@")[0],
          email: email.trim(),
          name: email.split("@")[0],
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("currentUser", JSON.stringify(user));
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("privilege@privokeep.app");
    setPassword("password123");
    setUsername("privilege");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2 dark:bg-gray-900">
        {/* Dark Visual Side */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 p-8 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
              PrivoKeep
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full bg-white/10 p-2 text-white/80 backdrop-blur transition hover:bg-white/20"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="my-12 flex flex-col items-center justify-center text-center">
            {/* Glowing moon graphic */}
            <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-red-400 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-500 to-amber-500 opacity-90 blur-[1px]"></div>
              <div className="absolute inset-0 rounded-full border border-red-300/30"></div>
            </div>
            <h3 className="text-xl font-bold text-white">Capture thoughts. Organize life.</h3>
            <p className="mt-2 text-sm text-gray-400">
              Your seamless personal workspace with color-coded notes and intuitive task boards.
            </p>
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 font-bold text-red-300 ring-1 ring-red-400/40">
              OP
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Oyegbile Privilege</p>
              <p className="text-xs text-gray-400">Software Developer</p>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isRegister
                ? "Start taking notes and managing tasks in seconds"
                : "Enter your credentials to access your notes"}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. privilege"
                    className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  {isRegister ? "Create Account" : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>

            <button
              type="button"
              onClick={fillDemo}
              className="rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
