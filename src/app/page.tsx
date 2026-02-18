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
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Login with Google
      </button>
    </div>
  );
}
