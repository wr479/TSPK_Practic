"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Главная", href: "/" },
  { label: "Участвовать", href: "/participate" },
  { label: "Истории", href: "/stories" },
  { label: "Для компаний", href: "/companies" },
  { label: "Роща славы", href: "/grove" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-stroke bg-white">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-foreground">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-white shadow-md">
            <img src="/simple-logo.svg" alt="logo" />
          </span>
          <span>ДеревьЯ</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${isActive ? "font-semibold text-foreground" : "hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label="Меню"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className="h-0.5 w-5 bg-foreground" />
            <span className="h-0.5 w-5 bg-foreground" />
            <span className="h-0.5 w-5 bg-foreground" />
          </div>
        </button>
      </div>
      {open ? (
        <div className="container pb-4 md:hidden">
          <nav className="flex flex-col gap-2 text-sm text-muted">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 transition ${isActive ? "bg-[#EEF8EA] font-semibold text-foreground" : "hover:bg-[#EEF8EA] hover:text-foreground"}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

