import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Budgeteer — Take control of your AI spend",
  description:
    "AI Budgeteer helps CFOs and engineering teams control AI spend, optimize prompts, and boost efficiency with real-time budget alerts and model routing.",
  keywords: [
    "AI budget",
    "cost optimization",
    "prompt optimizer",
    "AI spend",
    "model routing",
    "efficiency leaderboard",
  ],
  authors: [{ name: "AI Budgeteer" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AI Budgeteer — Take control of your AI spend",
    description:
      "Control AI budgets, optimize prompts, and rank team efficiency.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Set theme class synchronously before paint to prevent white flash.
            Default is dark; only switch to light if the user previously chose it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
