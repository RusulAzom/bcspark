"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Tab = "login" | "register";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (tab === "login") {
        await signIn(email, password);
        toast.success("Login successful!");
      } else {
        if (!name.trim()) {
          toast.error("Name is required for registration");
          setSubmitting(false);
          return;
        }
        await signUp(email, password, name.trim());
        toast.success("Account created successfully!");
      }
      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err?.code === "auth/user-not-found"
          ? "No account found with this email."
          : err?.code === "auth/wrong-password"
            ? "Incorrect password."
            : err?.code === "auth/email-already-in-use"
              ? "An account with this email already exists."
              : err?.code === "auth/invalid-credential"
                ? "Invalid email or password."
                : err?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <div className="flex mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                tab === "login"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
              {tab === "login" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                tab === "register"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
              {tab === "register" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required={tab === "register"}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.82-.07-1.61-.2-2.37H12v4.49h5.92a5.33 5.33 0 0 1-2.3 3.5v2.93h3.72c2.18-2 3.43-5 3.43-8.55z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.72-2.93c-.98.66-2.23 1.06-3.56 1.06-2.73 0-5.04-1.84-5.87-4.31H2.26v3.01C4.03 20.52 7.73 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.13 14.09A6.99 6.99 0 0 1 5.68 12c0-.72.1-1.42.29-2.09V7.09H2.26A11.97 11.97 0 0 0 1 12c0 1.93.46 3.76 1.26 5.38l3.87-3.29z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.58c1.54 0 2.93.53 4.02 1.58l3.02-3.02C17.45 1.19 14.97 0 12 0 7.73 0 4.03 2.48 2.26 6.62l3.87 3.01c.83-2.47 3.14-4.31 5.87-4.31z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
