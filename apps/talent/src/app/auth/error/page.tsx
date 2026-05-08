import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; error_description?: string };
}) {
  const description =
    searchParams.error_description?.replace(/\+/g, " ") ??
    "Something went wrong during sign in. Please try again.";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Sign in failed</h1>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
