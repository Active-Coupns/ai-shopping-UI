import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown, Globe, Mail } from "lucide-react";

export default function ProfileMenu({ user, onLogout, onOpenLogin, searchesLeft = 10 }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={onOpenLogin}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-xs md:text-sm font-semibold text-white transition-all shadow-md active:scale-95 cursor-pointer"
      >
        <User className="w-4 h-4" />
        <span>Sign In</span>
      </button>
    );
  }

  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const email = user.email || "";
  const country = user.user_metadata?.country || "IN";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer active:scale-98"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white text-xs font-bold shadow-md">
          {initials}
        </div>
        <div className="hidden md:block">
          <p className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">{name}</p>
          <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{searchesLeft} / 10 Left Today</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800/80 bg-slate-950/90 backdrop-blur-md p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* User Details */}
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-900">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{name}</p>
              <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>{email}</span>
              </p>
            </div>
          </div>

          {/* Metadata details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/50 text-slate-300">
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Target Country</span>
              </span>
              <span className="font-bold text-brand-indigo bg-brand-indigo/10 px-2 py-0.5 rounded-md text-[10px]">
                {country === "US" ? "USA (US)" : "India (IN)"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/50 text-slate-300">
              <span className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Daily Quota</span>
              </span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px]">
                {searchesLeft} / 10 Left
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
