"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function Home() {

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-blue-50 to-gray-100">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-gray-200">

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-3">
          Smart Bookmark Manager
        </h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          Securely store and manage your personal bookmarks.
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition font-medium text-gray-700 shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          Authentication powered by Google OAuth
        </p>
      </div>
    </div>
  );
}
