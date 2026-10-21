"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Camera, CheckSquare, Square, X, AlertTriangle, Sparkles, Check, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function VtonFacialConsentModal({ isOpen, onClose, onConsentAccepted }) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Specific Facial & Body Upload Checkpoints
  const [agreedItems, setAgreedItems] = useState({
    ephemeralZeroStorage: true,
    appropriateModestPhoto: true,
    noAiTraining: true,
    adultSelfOwnership: true,
  });

  if (!isOpen) return null;

  const toggleItem = (key) => {
    setAgreedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allMandatoryChecked = 
    agreedItems.ephemeralZeroStorage && 
    agreedItems.appropriateModestPhoto && 
    agreedItems.noAiTraining && 
    agreedItems.adultSelfOwnership;

  const handleProceed = async () => {
    if (!allMandatoryChecked) return;
    setIsSubmitting(true);
    const timestamp = new Date().toISOString();

    try {
      const email = user?.emailAddresses?.[0]?.emailAddress || "";
      await fetch("/api/compliance/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentType: "VTON_FACIAL_BIOMETRIC_PRIVACY",
          version: "1.0-prod",
          email,
          metadata: {
            ...agreedItems,
            acceptedAt: timestamp,
            facialLandmarkAlignmentConsent: true,
            modestAttirePolicyAccepted: true,
            storageType: "PERMANENT_DISK_LEDGER",
          }
        })
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("shopsmart_vton_facial_consent_v1", JSON.stringify({
          timestamp,
          version: "1.0-prod"
        }));
      }

      if (onConsentAccepted) {
        onConsentAccepted();
      }
    } catch (err) {
      console.warn("[VTON Consent] Fallback local record:", err);
      if (typeof window !== "undefined") {
        localStorage.setItem("shopsmart_vton_facial_consent_v1", JSON.stringify({
          timestamp,
          version: "1.0-prod"
        }));
      }
      if (onConsentAccepted) onConsentAccepted();
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-5 border-b border-purple-900/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <Camera className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/90 px-2 py-0.5 rounded border border-purple-800/60">
                    Facial & Body Try-On Privacy
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    सुरक्षित AI ट्रायल रूम & फोटो गाइडलाइन्स
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              आपकी फोटो की गोपनीयता और सुरक्षा हमारी 100% प्राथमिकता है। फोटो चुनने से पहले कृपया इन 4 सुरक्षा नियमों की पुष्टि करें।
            </p>
          </div>

          {/* Guidelines & Checkpoints Body */}
          <div className="p-4 sm:p-5 space-y-3 max-h-[60vh] overflow-y-auto">

            {/* Point 1: Zero Storage Guarantee */}
            <div 
              onClick={() => toggleItem("ephemeralZeroStorage")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                agreedItems.ephemeralZeroStorage 
                  ? "bg-purple-50/70 border-purple-200" 
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <button type="button" className="mt-0.5 text-purple-600 focus:outline-none">
                {agreedItems.ephemeralZeroStorage ? (
                  <CheckSquare className="w-4 h-4 fill-purple-100 text-purple-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    🛡️ शून्य स्थायी स्टोरेज (100% तुरंत डिलीट)
                  </span>
                  <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                    गारंटी
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                  हम आपकी फोटो को किसी भी स्थायी सर्वर या डेटाबेस में स्टोर नहीं करते। यह केवल रेंडरिंग के दौरान एक क्षणिक (RAM) प्रक्रिया से गुजरती है और परिणाम दिखते ही तुरंत हटा दी जाती है।
                </p>
              </div>
            </div>

            {/* Point 2: Appropriate Photo Policy */}
            <div 
              onClick={() => toggleItem("appropriateModestPhoto")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                agreedItems.appropriateModestPhoto 
                  ? "bg-emerald-50/70 border-emerald-200" 
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <button type="button" className="mt-0.5 text-emerald-600 focus:outline-none">
                {agreedItems.appropriateModestPhoto ? (
                  <CheckSquare className="w-4 h-4 fill-emerald-100 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    📸 उचित वस्त्र & फोटो गाइडलाइन्स
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    ज़रूरी
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                  कृपया पूरी तरह से कपड़े पहने हुए, अच्छी रोशनी में सामने की ओर खड़े होकर ली गई फोटो ही अपलोड करें। किसी भी प्रकार की आपत्तिजनक/न्यूडिटी छवि या बैकग्राउंड में संवेदनशील दस्तावेज़ (ID/Cards) सख्त वर्जित हैं।
                </p>
              </div>
            </div>

            {/* Point 3: No AI Training */}
            <div 
              onClick={() => toggleItem("noAiTraining")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                agreedItems.noAiTraining 
                  ? "bg-indigo-50/70 border-indigo-200" 
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <button type="button" className="mt-0.5 text-indigo-600 focus:outline-none">
                {agreedItems.noAiTraining ? (
                  <CheckSquare className="w-4 h-4 fill-indigo-100 text-indigo-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    🚫 शून्य AI मॉडल ट्रेनिंग गारंटी
                  </span>
                  <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                    नो-ट्रेनिंग
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                  आपकी फोटो या चेहरे की विशेषताओं का उपयोग कभी भी किसी AI मॉडल या एल्गोरिदम को सिखाने/ट्रेन करने के लिए नहीं किया जाएगा और न ही किसी तीसरे पक्ष को बेचा जाएगा।
                </p>
              </div>
            </div>

            {/* Point 4: Adult & Self Ownership */}
            <div 
              onClick={() => toggleItem("adultSelfOwnership")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                agreedItems.adultSelfOwnership 
                  ? "bg-amber-50/70 border-amber-200" 
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <button type="button" className="mt-0.5 text-amber-600 focus:outline-none">
                {agreedItems.adultSelfOwnership ? (
                  <CheckSquare className="w-4 h-4 fill-amber-100 text-amber-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    🔞 आयु और स्वामित्व पुष्टि (18+ Self-Consent)
                  </span>
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                    पुष्टि
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                  मैं पुष्टि करता हूँ कि यह फोटो मेरी स्वयं की है और मैं 18 वर्ष या उससे अधिक आयु का हूँ। कपड़े के कॉलर व कंधे की फिटिंग के लिए चेहरे और मुद्रा का केवल गणितीय मिलान किया जाएगा।
                </p>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500">
              स्थायी ऑडिट लेजर में टाइमस्टैम्प दर्ज रहेगा।
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
              >
                रद्द करें
              </button>
              <button
                type="button"
                disabled={!allMandatoryChecked || isSubmitting}
                onClick={handleProceed}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:from-purple-500 hover:to-indigo-600 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>प्रमाणित कर रहे हैं...</span>
                ) : (
                  <>
                    <span>स्वीकार करें & फोटो चुनें</span>
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
