"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  LogOut,
  Plus,
  Link as LinkIcon,
  Trash2,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({ title: "", url: "" });
  const [touched, setTouched] = useState({ title: false, url: false });

  useEffect(() => {
    let channel: any;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      const uid = session.user.id;

      // Initial fetch
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      setBookmarks(data || []);

      // Realtime (filtered by user)
      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => {
                if (prev.some((b) => b.id === payload.new.id)) return prev;
                return [payload.new, ...prev];
              });
            }

            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id),
              );
            }

            if (payload.eventType === "UPDATE") {
              setBookmarks((prev) =>
                prev.map((b) => (b.id === payload.new.id ? payload.new : b)),
              );
            }
          },
        )
        .subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const validateForm = () => {
    const newErrors = { title: "", url: "" };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (!url.trim()) {
      newErrors.url = "URL is required";
      isValid = false;
    } else {
      try {
        const urlToCheck = url.trim().toLowerCase();
        if (
          !urlToCheck.startsWith("http://") &&
          !urlToCheck.startsWith("https://")
        ) {
          newErrors.url = "URL must start with http:// or https://";
          isValid = false;
        } else {
          new URL(url.trim());
        }
      } catch {
        newErrors.url = "Please enter a valid URL";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const addBookmark = async () => {
    setTouched({ title: true, url: true });

    if (!validateForm()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("bookmarks").insert([
      {
        title: title.trim(),
        url: url.trim(),
        user_id: user.id,
      },
    ]);

    setTitle("");
    setUrl("");
    setErrors({ title: "", url: "" });
    setTouched({ title: false, url: false });
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "BUTTON") {
      addBookmark();
    }
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl">
              <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white truncate">
              My Bookmarks
            </h1>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs sm:text-sm rounded-full ml-auto sm:ml-0">
              {bookmarks.length}
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Add Bookmark Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title Input */}
              <div className="space-y-1">
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                      touched.title && errors.title
                        ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    }`}
                    placeholder="Bookmark title..."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (touched.title) {
                        setErrors((prev) => ({ ...prev, title: "" }));
                      }
                    }}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, title: true }))
                    }
                    onKeyPress={handleKeyPress}
                  />
                </div>
                {touched.title && errors.title && (
                  <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* URL Input */}
              <div className="space-y-1">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                      touched.url && errors.url
                        ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    }`}
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (touched.url) {
                        setErrors((prev) => ({ ...prev, url: "" }));
                      }
                    }}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, url: true }))
                    }
                    onKeyPress={handleKeyPress}
                  />
                </div>
                {touched.url && errors.url && (
                  <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.url}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={addBookmark}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Bookmark</span>
            </button>
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-3 sm:space-y-4">
          {bookmarks.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-block p-3 sm:p-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 sm:mb-4">
                <Bookmark className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
                No bookmarks yet. Add your first bookmark above!
              </p>
            </div>
          )}

          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="group bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col  md:flex-row justify-between items-center gap-3">
                <div
                  className="flex items-start gap-2 sm:gap-3 flex-1 w-full xs:w-auto cursor-pointer"
                  onClick={() => openUrl(b.url)}
                >
                  <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                    <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-blue-600 dark:text-blue-400 text-sm sm:text-base lg:text-lg truncate">
                        {b.title}
                      </h3>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] xs:max-w-[250px] sm:max-w-md">
                      {b.url}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 self-end xs:self-center text-xs sm:text-sm"
                  title="Delete bookmark"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="inline xs:hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
