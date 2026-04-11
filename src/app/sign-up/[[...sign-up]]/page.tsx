"use client";

import { SignUp, useClerk } from "@clerk/nextjs";

export default function SignUpPage() {
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
          <p style={{ fontSize: 13, color: "#6B7280" }}>Loading sign up...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
