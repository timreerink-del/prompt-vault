"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function SignUpPage() {
  const [showFallback, setShowFallback] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        gap: "24px",
      }}
    >
      <div id="clerk-loader" style={{ textAlign: "center" }}>
        <div
          style={{
            width: 20,
            height: 20,
            border: "2px solid var(--accent)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Loading sign up...</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
        appearance={{
          ...(theme === "dark" ? { baseTheme: dark } : {}),
          variables: {
            colorBackground: theme === "dark" ? "#1A1E27" : "#FFFFFF",
            colorPrimary: theme === "dark" ? "#5CEFB5" : "#9B5DE5",
            colorText: theme === "dark" ? "#FFFFFF" : "#1A1A2E",
            colorTextSecondary: theme === "dark" ? "#B0B5C3" : "#6B6B80",
            colorTextOnPrimaryBackground: theme === "dark" ? "#0B0D11" : "#FFFFFF",
            colorInputText: theme === "dark" ? "#FFFFFF" : "#1A1A2E",
            colorInputBackground: theme === "dark" ? "#232833" : "#F5F5F7",
            colorNeutral: theme === "dark" ? "#FFFFFF" : "#1A1A2E",
            borderRadius: "8px",
          },
        }}
      />

      {showFallback && (
        <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", maxWidth: 300 }}>
          Taking longer than expected. Check that your browser isn't blocking third-party scripts, or{" "}
          <a href="/" style={{ color: "var(--accent)", textDecoration: "underline" }}>
            go back home
          </a>.
        </p>
      )}
    </div>
  );
}
