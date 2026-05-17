import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Home() {
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">(
    "checking"
  );

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Try to query a simple table to test connection
        const { error } = await supabase.from("cabins").select("count", { count: "exact", head: true });
        
        if (error) {
          console.error("❌ Supabase Error:", error.message);
          setSupabaseStatus("error");
        } else {
          console.log("✅ Supabase Connected Successfully!");
          setSupabaseStatus("connected");
        }
      } catch (err) {
        console.error("❌ Connection Error:", err);
        setSupabaseStatus("error");
      }
    };

    checkSupabaseConnection();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome to the Hotel Booking System</p>
      </div>

      {/* Supabase Status */}
      <div
        className={`p-4 rounded-lg ${
          supabaseStatus === "connected"
            ? "bg-green-50 border border-green-200"
            : supabaseStatus === "error"
            ? "bg-red-50 border border-red-200"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <p
          className={`font-semibold ${
            supabaseStatus === "connected"
              ? "text-green-800"
              : supabaseStatus === "error"
              ? "text-red-800"
              : "text-blue-800"
          }`}
        >
          {supabaseStatus === "checking" && "🔄 Checking Supabase connection..."}
          {supabaseStatus === "connected" && "✅ Supabase is connected and working!"}
          {supabaseStatus === "error" && "❌ Supabase connection failed. Check console for details."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-4xl mb-2">🏨</div>
          <h3 className="text-lg font-semibold text-gray-900">Hotels</h3>
          <p className="text-gray-600 text-sm mt-2">Manage your hotels</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-4xl mb-2">📅</div>
          <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
          <p className="text-gray-600 text-sm mt-2">View all bookings</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-4xl mb-2">👥</div>
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          <p className="text-gray-600 text-sm mt-2">Manage users</p>
        </div>
      </div>
    </div>
  );
}