import { useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { supabase } from '../db/supabaseClient';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      setLoading(false);
      return;
    }

    // Get current user email
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;
    if (!email) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    // Confirm old password
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: oldPassword });
    if (signInError) {
      setError("Old password is incorrect.");
      setLoading(false);
      return;
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setError(error.message);
    else setSuccess("Password updated successfully!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <div className="flex-1 max-w-md mx-auto py-8 w-full mt-10">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Change Password</h1>
        <form onSubmit={handleChangePassword} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <label className="block mb-1 font-semibold dark:text-white" htmlFor="oldPassword">Old Password</label>
          <input
            id="oldPassword"
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
            required
          />
          <label className="block mb-1 font-semibold dark:text-white" htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
            required
          />
          <label className="block mb-1 font-semibold dark:text-white" htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
            required
          />
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {success && <div className="text-green-500 mb-2">{success}</div>}
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}