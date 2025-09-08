// "use client"

import { Providers } from "../providers";

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
        <div className="relative flex flex-col h-screen">
          <main className=" pt-16 px-6 flex-grow justify-center" style={{ padding:"0rem", margin: "0.5rem"}}>
            {children}
          </main>
        </div>
      </Providers>
  );
}
