import { useState } from "react";
import { apiPost } from "../lib/api";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    companyId?: string | null;
    companyName?: string | null;
  };
};

interface LoginProps {
  onLoginSuccess: (data: LoginResponse) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiPost<LoginResponse>("/login", {
        email,
        password,
      });

      localStorage.setItem("rafid_token", data.token);
      localStorage.setItem("rafid_user", JSON.stringify(data.user));

      onLoginSuccess(data);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-rafid bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Login</h2>
        <p className="text-gray-600 text-center mb-6">
          Sign in to access RAFID
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f5a7a]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f5a7a]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          Demo credentials:
          <div className="mt-1">supplier@rafid.com / password</div>
          <div>buyer@rafid.com / password</div>          <div>admin@rafid.com / password</div>        </div>
      </div>
    </section>
  );
}