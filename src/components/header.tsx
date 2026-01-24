import { BrainCircuit } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">Diagnostiq AI</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
