import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/providers";

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Diploma project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
