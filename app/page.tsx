import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers"; // Import cookies

export default function Home() {
  const isAdmin = cookies().get("isAdmin")?.value === 'true'; // Check if user is admin
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <Link href="/input">
        <Button>Enter Calculator</Button>
      </Link>
      {isAdmin && (
        <Link href="/admin">
          <Button className="mt-4">Enter Admin Panel</Button>
        </Link>
      )}
    </div>
  )
}