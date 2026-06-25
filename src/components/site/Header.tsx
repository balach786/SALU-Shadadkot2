import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { SITE } from "@/lib/config";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/admissions", label: "Admissions" },
  { to: "/campus-life", label: "Campus Life" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="SALU Shadadkot Campus crest" className="h-12 w-12 object-contain" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-[15px] font-bold text-primary">
              Shah Abdul Latif University
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {SITE.campus}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              activeProps={{ className: "text-primary bg-secondary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search applications"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/70 hover:bg-secondary hover:text-primary lg:inline-flex"
            onClick={() => {
              window.location.href = "/admissions#search";
            }}
          >
            <Search className="h-4 w-4" />
          </button>
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link to="/admissions">Apply Now</Link>
          </Button>
          <button
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-primary hover:bg-secondary lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-x flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/85 hover:bg-secondary hover:text-primary"
                activeProps={{ className: "text-primary bg-secondary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="gold" className="mt-2 w-full">
              <Link to="/admissions" onClick={() => setOpen(false)}>Apply Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
