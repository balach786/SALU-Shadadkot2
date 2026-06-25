import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";
import { SITE } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-12 w-12 rounded-md bg-white/10 p-1" />
            <div className="leading-tight">
              <p className="font-display text-base font-bold">{SITE.name}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
                {SITE.campus}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80">
            A modern campus committed to research, ethical leadership, and academic excellence in
            the heart of Sindh.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { href: SITE.facebook, Icon: Facebook },
              { href: SITE.twitter, Icon: Twitter },
              { href: SITE.instagram, Icon: Instagram },
              { href: SITE.youtube, Icon: Youtube },
            ].map(({ href, Icon }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold hover:text-gold-foreground"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Quick Links
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/about", "About"],
              ["/programs", "Programs"],
              ["/admissions", "Admissions"],
              ["/campus-life", "Campus Life"],
              ["/news", "News"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-primary-foreground/85 hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Contact
          </p>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 text-gold" /><span>{SITE.address}</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-gold" /><span>{SITE.phone}</span></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-gold" /><span>{SITE.email}</span></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Admissions Open
          </p>
          <p className="mt-4 text-sm text-primary-foreground/85">
            Apply online for Fall 2026 admissions. Receive your applicant card instantly with a
            verifiable QR code.
          </p>
          <Link
            to="/admissions"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground shadow-gold transition hover:brightness-105"
          >
            Start Application
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-primary-foreground/70 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}, {SITE.campus}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/contact" className="hover:text-gold">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-gold">Terms</Link>
            <Link to="/admin" className="hover:text-gold">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
