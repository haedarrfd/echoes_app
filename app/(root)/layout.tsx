import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";
import TopBar from "@/components/shared/TopBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import BottomBar from "@/components/shared/BottomBar";

export const metadata = {
  title: "Echoes",
  description: "Echoes App build by Next.js 13 ",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Clerk Provider
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          {/* Layout Topbar */}
          <TopBar />

          <main className="flex flex-row">
            {/* Layout Left Sidebar */}
            <LeftSidebar />

            {/* Main Section / Container */}
            <section className="main_container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>

            {/* Layout Right Sidebar */}
            <RightSidebar />
          </main>

          {/* Layout Bottombar */}
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
