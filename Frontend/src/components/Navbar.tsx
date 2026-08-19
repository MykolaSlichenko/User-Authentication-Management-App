import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#home" className="text-lg font-semibold tracking-tight text-slate-900">
          Logo
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={logout}
          className="hidden rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 md:inline-flex"
        >
          Logout
        </button>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="mt-2 rounded-full bg-slate-800 px-4 py-2 text-left text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
