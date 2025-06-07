import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/store/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Guelma University Incubator Platform",
  description: "Manage and monitor incubated startup projects over a 12-month program",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
          </ThemeProvider>
        </ReduxProvider>
          <Toaster position="top-right" />
      </body>
    </html>
  );
}
