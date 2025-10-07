import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script src="https://kit.fontawesome.com/d55a4b8e99.js" crossOrigin="anonymous"></script>
        <link href="https://fonts.googleapis.com/css2?family=Delius&family=Josefin+Slab:ital,wght@0,100..700;1,100..700&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"></link>
      </head>
      <body
        className={clsx(
          "h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <div className="relative flex flex-col h-screen bg-[#FDF6E3]">
              <main className=" pt-16 px-6 flex-grow justify-center" style={{ padding:"0rem"}}>
                  {children}
              </main>
            </div>
          </Providers>
      </body>
    </html>
  );
}
