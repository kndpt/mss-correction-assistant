"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <nav className="flex gap-1 p-1 rounded-full bg-white shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/" ? "bg-black/[.08]" : "hover:bg-black/[.04]"
          }`}
        >
          Accueil
        </Link>
        <Link
          href="/reformulation"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/reformulation" ? "bg-black/[.08]" : "hover:bg-black/[.04]"
          }`}
        >
          Reformulation
        </Link>
      </nav>
    </div>
  );
}
