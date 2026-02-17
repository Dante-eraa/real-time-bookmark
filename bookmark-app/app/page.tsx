"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Bookmark, Shield, Zap, Lock, Github, Mail } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-gray-100/[0.02] bg-[size:40px_40px]" />

      <div className="relative w-full max-w-sm md:max-w-md px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          {/* Logo and Title */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
              <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Bookmark App
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Save and manage your favorite links securely
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 mb-1" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                Secure
              </span>
            </div>
            <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 mb-1" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                Fast
              </span>
            </div>
            <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mb-1" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                Private
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-3 sm:py-4 px-4 rounded-xl sm:rounded-2xl font-medium hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.67 1.22 9.16 3.61l6.83-6.83C35.93 2.7 30.36 0 24 0 14.62 0 6.53 5.37 2.69 13.17l7.96 6.18C12.69 13.06 17.85 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.68c-.55 2.95-2.17 5.45-4.63 7.12l7.19 5.59C43.96 37.64 46.5 31.6 46.5 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.65 28.35A14.5 14.5 0 019.5 24c0-1.51.26-2.96.73-4.35l-7.96-6.18A23.96 23.96 0 000 24c0 3.86.93 7.51 2.69 10.83l7.96-6.48z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.36 0 11.7-2.1 15.6-5.73l-7.19-5.59c-2 1.34-4.55 2.14-8.41 2.14-6.15 0-11.31-3.56-13.35-8.85l-7.96 6.48C6.53 42.63 14.62 48 24 48z"
                  />
                </svg>
                <span className="text-sm sm:text-base font-medium group-hover:scale-105 transition-transform">
                  Continue with Google
                </span>
              </>
            )}
          </button>

          {/* Alternative Options */}
          <div className="mt-4 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
                  Secure login
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              More options coming soon
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-6 sm:mt-8">
          Secure • Private • Real-Time
        </p>

        {/* Version */}
        <p className="text-center text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-2">
          v1.0.0
        </p>
      </div>
    </div>
  );
}
