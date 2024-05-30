"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';

export default function Navbar({ username }: { username?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.refresh()
  }

  function handleLogin() {
    router.push('/login');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-background z-50">
      <div className="text-foreground text-lg font-semibold ml-2">DQPaints</div>
      <div className="flex items-center space-x-4">
        {username ? (
          <>
            <span className="text-foreground">Welcome, {username}!</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={handleLogin}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}