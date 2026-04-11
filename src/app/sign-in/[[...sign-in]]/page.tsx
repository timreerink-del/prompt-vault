"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function SignInPage() {
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
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Loading sign in...</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/"
        appearance={{
          ...(theme === "dark" ? { baseTheme: dark } : {}),
          variables: {
            colorBackground: theme === "dark" ? "#13161C" : "#FFFFFF",
            colorPrimary: theme === "dark" ? "#5CEFB5" : "#9B5DE5",
            colorText: theme === "dark" ? "#E4E6EB" : "#2D2240",
            colorTextSecondary: theme === "dark" ? "#7A7F8E" : "#8A7FA0",
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
