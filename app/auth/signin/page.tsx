import { SignInButton } from "@/components/auth/SignInButton";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-black text-blue-600 mb-1">BisSpa</h1>
        <p className="text-gray-500 text-sm mb-8">ビジスペ — 自分に合った作業場所を探そう</p>
        <SignInButton
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          label="Googleでログイン"
        />
        <p className="text-xs text-gray-400 mt-6">
          ログインすることで、お気に入りや閲覧履歴が記録されます
        </p>
      </div>
    </main>
  );
}
