import { redirect } from 'next/navigation';
import { validateAdmin, setAdminCookie } from '@/lib/admin-auth';

async function loginAction(formData: FormData) {
  'use server';
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (validateAdmin(username, password)) {
    await setAdminCookie();
    redirect('/admin');
  }

  redirect('/admin/login?error=1');
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === '1';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a0000_0%,_#0A0A0A_70%)] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            JOMO <span className="text-[#E8002D]">AUTO</span> WORLD
          </h1>
          <p className="text-zinc-400 text-sm mt-1 tracking-widest uppercase">
            Admin Panel
          </p>
          <div className="mt-3 h-px w-16 bg-[#E8002D] mx-auto rounded-full" />
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/60">
          <h2 className="text-white text-lg font-semibold mb-1">Sign in</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Enter your admin credentials to continue.
          </p>

          <form action={loginAction} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#E8002D] focus:ring-1 focus:ring-[#E8002D] transition-colors"
                placeholder="admin"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#E8002D] focus:ring-1 focus:ring-[#E8002D] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {hasError && (
              <div className="text-[#E8002D] text-sm bg-red-950/40 border border-red-900/40 rounded-lg px-3 py-2">
                Invalid username or password. Please try again.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#E8002D] hover:bg-[#c5001f] active:bg-[#a0001a] text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-sm tracking-wide"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6">
          Jomo Auto World — Secure Admin Access
        </p>
      </div>
    </div>
  );
}
