"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
    subscribeRealtime();
  }, []);

  const initialize = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/";
      return;
    }

    setUser(data.user);
    await fetchBookmarks();
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch bookmarks");
    }

    setBookmarks(data || []);
  };

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        title: title.trim(),
        url: url.trim(),
        user_id: userData.user.id,
      },
    ]);

    if (error) {
      toast.error("Failed to add bookmark");
    } else {
      toast.success("Bookmark added!");
      setTitle("");
      setUrl("");
    }
  };

  const deleteBookmark = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this bookmark?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete bookmark");
    } else {
      toast.success("Bookmark deleted");
    }
  };

  const subscribeRealtime = () => {
    supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();
  };

  return (
    <div className={`${darkMode ? "dark bg-gray-900" : "bg-gray-50"} min-h-screen transition-colors`}>
      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm px-4 sm:px-6 py-4 relative">
        <div className="flex justify-between items-center">

            {/* Left Section */}
            <div className="flex items-center gap-3">
            <img
                src={
                user?.user_metadata?.avatar_url ||
                user?.user_metadata?.picture ||
                "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user?.email || "User")
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
            />

            <div className="hidden sm:block">
                <p className="font-medium text-gray-800 dark:text-white">
                {user?.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                {user?.email}
                </p>
            </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center gap-4">
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-sm px-3 py-1.5 border rounded-md dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
                {darkMode ? "Light" : "Dark"}
            </button>

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            >
                Logout
            </button>
            </div>

            {/* Mobile Hamburger */}
            <button
            className="sm:hidden text-gray-800 dark:text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            >
            ☰
            </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
            <div className="sm:hidden mt-4 bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 space-y-3">
            <button
                onClick={() => {
                setDarkMode(!darkMode);
                setMenuOpen(false);
                }}
                className="block w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button
                onClick={handleLogout}
                className="block w-full text-left text-sm px-3 py-2 rounded text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
                Logout
            </button>
            </div>
        )}
      </nav>



      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-6">

        {/* Add Bookmark Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            Add Bookmark
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={addBookmark}
              disabled={!title.trim() || !url.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
            >
              Add
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 animate-pulse">
            No bookmarks yet 🚀
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <p className="font-medium dark:text-white">{b.title}</p>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {b.url}
                  </a>
                </div>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
