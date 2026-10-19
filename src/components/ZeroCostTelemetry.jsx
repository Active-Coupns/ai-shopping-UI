"use client";

import React, { Component, useEffect } from "react";

// Track report count per session to prevent log flooding
let reportedCrashesInSession = 0;
const MAX_CRASH_REPORTS_PER_SESSION = 3;

/**
 * Report an error to the In-House Admin Crash Vault
 */
export function reportClientCrash({
  error = null,
  message = "",
  component = "client_runtime",
  severity = "error",
  meta = {}
}) {
  if (typeof window === "undefined") return;
  if (reportedCrashesInSession >= MAX_CRASH_REPORTS_PER_SESSION) return;

  reportedCrashesInSession++;

  try {
    const payload = {
      message: (error?.message || message || "Unhandled Client Exception").slice(0, 300),
      error: (error?.stack || message || "").slice(0, 800),
      component,
      route: window.location.pathname || "/",
      severity,
      meta: {
        userAgent: navigator.userAgent?.slice(0, 150) || "Unknown Browser",
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        timestamp: new Date().toISOString(),
        ...meta
      }
    };

    fetch("/api/admin/crashes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  } catch (e) {
    // Silent fail - telemetry should never impact user experience
  }
}

/**
 * Global Client Error Listener Hook Component
 * Catches unhandled browser exceptions and promise rejections
 */
export function GlobalClientTelemetry() {
  useEffect(() => {
    function handleWindowError(event) {
      // Ignore non-actionable cross-origin script errors or browser extension errors
      if (!event.error && !event.message) return;
      if (event.filename && (event.filename.includes("extension://") || event.filename.includes("chrome://"))) {
        return;
      }

      reportClientCrash({
        error: event.error,
        message: event.message || "Window Runtime Error",
        component: "client_window_error",
        severity: "error",
        meta: {
          filename: event.filename ? event.filename.split("/").pop() : "unknown",
          lineno: event.lineno,
          colno: event.colno
        }
      });
    }

    function handleUnhandledRejection(event) {
      const reason = event.reason;
      const errorMsg = typeof reason === "string" ? reason : (reason?.message || "Unhandled Promise Rejection");
      
      // Ignore benign aborted fetches (e.g. user navigated away)
      if (errorMsg.includes("AbortError") || errorMsg.includes("cancelled")) return;

      reportClientCrash({
        error: reason instanceof Error ? reason : new Error(errorMsg),
        message: errorMsg,
        component: "client_unhandled_promise",
        severity: "warning"
      });
    }

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}

/**
 * Enterprise React Error Boundary
 * Prevents entire screen from turning blank if a sub-component throws during rendering.
 */
export class ClientErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    reportClientCrash({
      error,
      message: error?.message || "React Component Render Crash",
      component: this.props.componentName || "ReactErrorBoundary",
      severity: "critical",
      meta: {
        componentStack: (errorInfo?.componentStack || "").slice(0, 500)
      }
    });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full max-w-xl mx-auto my-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
            ⚠️
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            Component Recovered Seamlessly
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            An unexpected render issue was automatically reported to our admin reliability vault. Your session remains secure.
          </p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            Refresh Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
