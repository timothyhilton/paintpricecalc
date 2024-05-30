import "./globals.css";
import Navbar from "./navbar";
import { cookies } from "next/headers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const username = cookies().get("currentUser")?.value || "";

  return (
    <html lang="en">
      <body>
        <Navbar username={username} />
        {children}
      </body>
    </html>
  )
}
