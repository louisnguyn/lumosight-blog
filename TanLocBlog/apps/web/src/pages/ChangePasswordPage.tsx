// ChangePasswordModal.tsx
import {useState,useEffect} from "react"
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { supabase } from '../db/supabaseClient';

export default function ChangePasswordPage({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <Header/>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
            required
          />
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {success && <div className="text-green-500 mb-2">{success}</div>}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
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
      <Footer/>
    </div>
  );
}