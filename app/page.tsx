import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center">
      <Link href="/input">
        <Button>Enter app</Button>
      </Link>
    </div>
  )
}