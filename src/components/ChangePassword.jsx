import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebase";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const user = auth.currentUser;
    if (!user) {
      setError("No user is currently logged in.");
      return;
    }

    try {
      await updatePassword(user, newPassword); 
      setSuccess("Password updated successfully.");
      setNewPassword(""); 
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Change Password</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
