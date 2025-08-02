import SideNav from "@/components/SideNav";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Kindly Hub | Admin dashboard",
  description: "Manage your donation campaigns, track contributions, and view detailed analytics from your secure admin portal.",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png'
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex h-screen w-full overflow-hidden">
        <SideNav />
        {children}
    </section>
  );
}
