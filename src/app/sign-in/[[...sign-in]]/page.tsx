"use client";

import { SignIn, useClerk } from "@clerk/nextjs";

export default function SignInPage() {
  const { loaded } = useClerk();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFFFFF",
        color: "#111827",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        gap: "24px",
      }}
    >
      {/* Spinner — only visible until Clerk is loaded */}
      {!loaded && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 20,
              height: 20,
              border: "2px solid #6B7280",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ fontSize: 13, color: "#6B7280" }}>Loading sign in...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
