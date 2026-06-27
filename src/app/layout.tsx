import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApplicationProvider } from "@/contexts/ApplicationContext";

export const metadata: Metadata = {
  title: "Nexus | Premium Job Application CRM",
  description: "Track your job applications, automate interview prep, and analyze your conversion funnel with Nexus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ApplicationProvider>
            {children}
          </ApplicationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
