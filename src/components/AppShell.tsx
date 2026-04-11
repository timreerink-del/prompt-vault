"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import ThemeProvider, { useTheme } from "./ThemeProvider";

function ClerkWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <ClerkProvider
      appearance={theme === "dark" ? { baseTheme: dark } : {}}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClerkWrapper>{children}</ClerkWrapper>
    </ThemeProvider>
  );
}
