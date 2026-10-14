import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-white relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Back to Home Link */}
      <div className="relative z-10 mb-6 flex flex-col items-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to ShopSmart AI</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            ShopSmart <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Join in 1-Click with Google or Apple</p>
      </div>

      <div className="relative z-10 w-full max-w-sm flex justify-center">
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
