import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-2">
      <Button asChild>
        <Link href={"signin"}>Sign In</Link>
      </Button>
      <Button asChild>
        <Link href={"signup"}>Sign Up</Link>
      </Button>
    </div>
  );
}
