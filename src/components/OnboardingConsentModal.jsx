"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CheckSquare, Square, Trash2, ShoppingBag, Shirt, Pill, ExternalLink, ChevronRight, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function OnboardingConsentModal({ onConsentComplete }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Granular Checkpoint States
  const [consents, setConsents] = useState({
    smartShoppingConvenience: true,
    publicMarketplaceAggregator: true,
    completeDataErasureAcknowledged: true,
    vtonEphemeralTerms: true,
  });

  useEffect(() => {
    // Check if consent has already been recorded locally
    const stored = typeof window !== "undefined" ? localStorage.getItem("shopsmart_consent_record_v1") : null;
    if (!stored) {
      // Small graceful entrance delay so the UI doesn't violently flash on load
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleConsent = (key) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptAll = async () => {
    const allChecked = {
      smartShoppingConvenience: true,
      publicMarketplaceAggregator: true,
      completeDataErasureAcknowledged: true,
      vtonEphemeralTerms: true,
    };
    setConsents(allChecked);
    await submitConsent(allChecked);
  };

  const handleSaveSelected = async () => {
    await submitConsent(consents);
  };

  const submitConsent = async (consentPayload) => {
    setIsSubmitting(true);
    const timestamp = new Date().toISOString();

    try {
      const email = user?.emailAddresses?.[0]?.emailAddress || "";
      const res = await fetch("/api/compliance/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentType: "GENERAL_PLATFORM_ONBOARDING",
          version: "1.0-prod",
          email,
          metadata: {
            ...consentPayload,
            acceptedAt: timestamp,
            locale: "hi-IN",
          }
        })
      });

      const data = await res.json().catch(() => ({}));

      const auditRecord = {
        consentId: data.consentId || `cst_${Date.now()}`,
        timestamp,
        version: "1.0-prod",
        consents: consentPayload
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("shopsmart_consent_record_v1", JSON.stringify(auditRecord));
      }

      setIsOpen(false);
      if (onConsentComplete) {
        onConsentComplete(auditRecord);
      }
    } catch (err) {
      console.warn("[Consent Modal] Non-blocking consent fallback:", err);
      // Fallback local save to not block user interaction
      const fallbackRecord = {
        consentId: `cst_local_${Date.now()}`,
        timestamp,
        version: "1.0-prod",
        consents: consentPayload
      };
      localStorage.setItem("shopsmart_consent_record_v1", JSON.stringify(fallbackRecord));
      setIsOpen(false);
      if (onConsentComplete) onConsentComplete(fallbackRecord);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border-b border-indigo-900/40">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                  Privacy & Trust First
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Welcome to ShopSmart AI
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              पारदर्शी, सुरक्षित और निष्पक्ष शॉपिंग अनुभव के लिए आपकी सहमति। हम आपकी सुविधा और गोपनीयता को सर्वोच्च प्राथमिकता देते हैं।
            </p>
          </div>

          {/* Granular Checkpoints List */}
          <div className="p-4 sm:p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">

            {/* Checkpoint 1: Smart Shopping Convenience */}
            <div 
              onClick={() => toggleConsent("smartShoppingConvenience")}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                consents.smartShoppingConvenience 
                  ? "bg-indigo-50/60 border-indigo-200" 
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <button type="button" className="mt-0.5 text-indigo-600 focus:outline-none">
                {consents.smartShoppingConvenience ? (
                  <CheckSquare className="w-5 h-5 fill-indigo-100 text-indigo-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    🛍️ स्मार्ट शॉपिंग सुविधा & इंटेंट मेमोरी
                  </span>
                  <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded">
                    सुविधा
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  आपकी बेहतर सुविधा और बजट अनुसार सबसे सटीक डील्स खोजने के लिए आपकी प्राथमिकताओं (बजट, पसंदीदा ब्रांड्स) का सुरक्षित सेशन उपयोग।
                </p>
              </div>
            </div>

            {/* Checkpoint 2: Market Neutrality */}
            <div 
              onClick={() => toggleConsent("publicMarketplaceAggregator")}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                consents.publicMarketplaceAggregator 
                  ? "bg-emerald-50/60 border-emerald-200" 
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <button type="button" className="mt-0.5 text-emerald-600 focus:outline-none">
                {consents.publicMarketplaceAggregator ? (
                  <CheckSquare className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    ⚖️ सार्वजनिक बाज़ार मूल्य & निष्पक्षता
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded">
                    निष्पक्ष
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  हम केवल स्वतंत्र, सार्वजनिक रूप से उपलब्ध बाज़ार मूल्य और ऑफ़र्स दिखाते हैं; हम किसी ब्रांड का प्रचार नहीं करते। फार्मेसी/सप्लीमेंट्स केवल मूल्य तुलना के लिए हैं (कोई चिकित्सीय सलाह नहीं)।
                </p>
              </div>
            </div>

            {/* Checkpoint 3: Complete Erasure Guarantee */}
            <div 
              onClick={() => toggleConsent("completeDataErasureAcknowledged")}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                consents.completeDataErasureAcknowledged 
                  ? "bg-rose-50/60 border-rose-200" 
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <button type="button" className="mt-0.5 text-rose-600 focus:outline-none">
                {consents.completeDataErasureAcknowledged ? (
                  <CheckSquare className="w-5 h-5 fill-rose-100 text-rose-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    🔒 100% डेटा डिलीट कंट्रोल (Right to Erasure)
                  </span>
                  <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">
                    गारंटी
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  आपकी प्रोफाइल में 1-क्लिक 'Delete Account & Purge Data' का विकल्प मौजूद है। आप जब चाहें अपना पूरा डेटा और अकाउंट हमारे सर्वर से हमेशा के लिए तुरंत मिटा सकते हैं।
                </p>
              </div>
            </div>

            {/* Checkpoint 4: Virtual Try-On Terms */}
            <div 
              onClick={() => toggleConsent("vtonEphemeralTerms")}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                consents.vtonEphemeralTerms 
                  ? "bg-purple-50/60 border-purple-200" 
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <button type="button" className="mt-0.5 text-purple-600 focus:outline-none">
                {consents.vtonEphemeralTerms ? (
                  <CheckSquare className="w-5 h-5 fill-purple-100 text-purple-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    👗 वर्चुअल ट्राई-ऑन प्राइवेसी (VTON Ephemeral)
                  </span>
                  <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded">
                    सुरक्षित AI
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  ट्रायल रूम में कपड़े का विज़ुअल फिटिंग अनुभव देने के लिए फोटो की केवल क्षणिक (अस्थाई) डिजिटल प्रोसेसिंग। कोई स्थायी स्टोरेज नहीं, कोई AI मॉडल ट्रेनिंग नहीं। (18+ आयु पुष्टि)।
                </p>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 text-center sm:text-left">
              स्वीकृति का समय और ऑडिट आईडी Upstash Redis में सुरक्षित दर्ज रहेगा।
            </span>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveSelected}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
              >
                चयनित सेव करें
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-700 transition flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>सहेज रहे हैं...</span>
                ) : (
                  <>
                    <span>सभी स्वीकार करें & आगे बढ़ें</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
